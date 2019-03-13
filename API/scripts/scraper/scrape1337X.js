const cs = require('cloudscraper')
const $ = require('cheerio')
const _ = require('lodash')
const {
  isEmpty,
  sleep,
  whatTimeIsIt,
} = require('../../src/utils')

const BASE_URL = 'https://1337x.to'

/*
 Input: 320 Mo
 Ouput: 320 * 1024 * 1024
*/
const getUnixSizeFromHumanReadableSize = (size) => {
  if (size.toLowerCase().indexOf('mb') > -1 || size.toLowerCase().indexOf('mo') > -1) return parseInt(size.split(' ')[0], 10) * 1024 * 1024
  return parseInt(size.split(' ')[0], 10) * 1024 * 1024 * 1024
}

const scrape1337Link = url => (
  new Promise(resolve => (
    cs.get(url, (err, res, body) => {
      console.log(`${whatTimeIsIt()} 1337x scraping torrent page... [${url}]`)
      if (err) {
        console.log(`${whatTimeIsIt()} Cannot scrape torrent page... [${url}] (${JSON.stringify(err)}).`)
        return resolve({})
      }
      return resolve({
        source: '1337x',
        torrent: $('.download-links-dontblock li:first-child a', body)[0].attribs.href.split('&tr')[0],
        language: _.get($('.list li:nth-child(3) span', body)[0], 'children[0].data', 'ENGLISH').toUpperCase(),
        quality: $('.list li:nth-child(2) span', body)[0].children[0].data.toUpperCase(),
        seeds: parseInt($('.list li:nth-child(4) span', body)[1].children[0].data, 10),
        leechers: parseInt($('.list li:nth-child(5) span', body)[1].children[0].data, 10),
        size: {
          human_readable: $('.list li:nth-child(4) span', body)[0].children[0].data,
          unix: getUnixSizeFromHumanReadableSize($('.list li:nth-child(4) span', body)[0].children[0].data),
        },
      })
    })
  ))
)

const scrape1337Links = links => (
  new Promise((resolve) => {
    const promises = []
    sleep(2000)
    Object.keys(links).forEach((key) => {
      if (_.get(links[key], 'children[1]')) {
        promises.push(scrape1337Link(`${BASE_URL}${links[key].children[1].attribs.href}`))
      }
    })
    Promise.all(promises).then(torrents => resolve(torrents))
  })
)

const scrape1337LinksPage = movie => (
  new Promise(resolve => (
    cs.get(movie.torrent, async (err, res, body) => {
      console.log(`${whatTimeIsIt()} 1337x scraping links at ${movie.torrent}`)
      try {
        _.omit(movie, 'torrent')
        Object.assign(movie, {
          title: $('h3.featured-heading strong', body)[0].children[0].data.slice(9, -16),
          cover: `https:${$('div.torrent-image img', body)[0].attribs.src}`,
          year: parseInt($('h3.featured-heading strong', body)[0].children[0].data.slice(-14, -10), 10),
          torrents: await scrape1337Links($('tr td.name', body)),
        })
        return resolve(movie)
      } catch (e) {
        console.log(`${whatTimeIsIt()} Cannot scrape links at ${movie.torrent} (${JSON.stringify(err)}).`)
        return resolve({})
      }
    })
  ))
)

const scrape1337Page = page => (
  new Promise(resolve => (
    cs.get(`${BASE_URL}/movie-library/${page}/`, async (err, res, body) => {
      console.log(`${whatTimeIsIt()} 1337x scraping page ${page}... [${BASE_URL}/movie-library/${page}/]`)
      if (err) {
        console.log(`${whatTimeIsIt()} Cannot scrape page ${page}: an error occured (${JSON.stringify(err)}).`)
        return resolve([])
      }
      let i = 0
      const movies = []
      const titles = $('h3', body)
      const descriptions = $('.content-row', body)
      const categories = $('.category', body)
      const ratings = $('.rating i', body)
      try {
        while (titles[i] !== undefined) {
          const genres = []
          // eslint-disable-next-line
          Object.keys(categories[i].children).forEach((child) => {
            if (categories[i].children[child].name === 'span') {
              genres.push(categories[i].children[child].children[0].data)
            }
          })
          const movie = {
            description: descriptions[i].children[1].children[0].data.trim(),
            rating: parseInt(ratings[i].attribs.style.replace('width: ', '').replace('%;', ''), 10) / 10,
            torrent: `${BASE_URL}${titles[i].children[0].attribs.href}`,
            genres,
          }
          movies.push(await scrape1337LinksPage(movie)) // eslint-disable-line
          i += 1
        }
      } catch (e) {
        console.log(`${whatTimeIsIt()} an error occured while parsing 1337x page ${page}: ${e}`)
      }
      return resolve(movies)
    })
  ))
)

const scrape1337NumberOfPages = () => (
  new Promise((resolve, reject) => (
    cs.get(`${BASE_URL}/movie-library/1/`, async (err, res, body) => {
      console.log('1337X scraping number of pages...')
      if (err) return reject(err)
      return resolve(parseInt($('.last a', body).attr('href').split('/')[2], 10))
    })
  ))
)

const scrape1337X = async () => {
  let currentPage = 1
  const numberOfPages = await scrape1337NumberOfPages()
  // Uncomment the line below for testing purpose
  // const numberOfPages = 3
  console.log(`Number of page ${numberOfPages}`)

  // Fetch all movies
  const movies = []
  do {
    const moviesList = await scrape1337Page(currentPage) // eslint-disable-line
    if (!isEmpty(moviesList)) movies.push(...moviesList)
    currentPage += 1
    sleep(2000)
  } while (currentPage <= numberOfPages)
  return movies
}

module.exports = scrape1337X
