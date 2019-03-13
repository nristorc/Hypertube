const cs = require('cloudscraper')
const $ = require('cheerio')
const _ = require('lodash')
const {
  isEmpty,
  recursiveRegex,
  sleep,
  timeoutPromise,
  whatTimeIsIt,
} = require('../../src/utils')

/*
 Input: Iron Sky VOSTFR DVDRIP 2012
 Ouput: Iron Sky
*/
const beautifyTitle = (title) => {
  let result = title.slice(12)
  const separators = [
    '(Trilogie)',
    '(trilogie)',
    '(Integrale)',
    '(integrale)',
    'WEBRIP',
    'DVDRIP',
    'Dvdrip',
    'DVDSCR',
    'HDlight',
    'TRUEFRENCH',
    'FRENCH',
    'ENGLISH',
    'VOST',
    '1CD',
    '2CD',
    '3CD',
    '4CD',
    '5CD',
  ]
  separators.forEach((separator) => {
    if (result.indexOf(separator) > -1) result = result.slice(0, result.indexOf(separator))
  })
  return result.trim()
}

/*
 Input: Iron Sky VOSTFR DVDRIP 2012
 Ouput: dvdrip
*/
const getQualifyFromTitle = (title) => {
  let quality
  const separators = [
    'webrip',
    'dvdrip',
    'dvdscr',
    'hdlight',
    'truefrench',
  ]
  separators.forEach((separator) => {
    if (title.toLowerCase().indexOf(separator) > -1) quality = separator
  })
  return quality
}

/*
  Input: Iron Sky FRENCH DVDRIP 2012
  Output: French
*/
const getLanguageFromTitle = (title) => {
  if (title.indexOf('FRENCH') > -1) return 'French'
  if (title.indexOf('ENGLISH') > -1) return 'English'
  if (title.indexOf('SPANISH') > -1) return 'Spanish'
  if (title.indexOf('GERMAN') > -1) return 'German'
  return 'English'
}

/*
 Input: 320 Mo
 Ouput: 320 * 1024 * 1024
*/
const getUnixSizeFromHumanReadableSize = (size) => {
  if (size.toLowerCase().indexOf('mo') > -1) return parseInt(size.split(' ')[0], 10) * 1024 * 1024
  return parseInt(size.split(' ')[0], 10) * 1024 * 1024 * 1024
}

/*
  Input: Le Solitaire FRENCH HDlight 1080p 1981
  Output: 1981
*/
const getYearFromTorrentName = (title) => {
  let year
  const regexResults = recursiveRegex(/\d{4}/, title)
  regexResults.forEach((result) => {
    const parsedYear = parseInt(result, 10)
    if (parsedYear > 1950 && parsedYear < new Date().getFullYear() + 2) {
      year = parsedYear
    }
  })
  return year
}

const scrapeNumberOfPages = () => (
  new Promise((resolve, reject) => (
    cs.get('https://wvw.torrent9.uno/torrents_films.html', (err, res, body) => {
      console.log('Torrent 9 scraping number of pages...')
      if (err) return reject(err)
      return resolve(parseInt($('.pagination li', body).eq(-2).text(), 10))
    })
  ))
)

/*
  Translate genre into IMDB genre
*/
const manualTranslationOfGenres = (genre) => {
  if (genre === 'Action') return 'Action'
  if (genre === 'Animation') return 'Animation'
  if (genre === 'Aventure') return 'Adventure'
  if (genre === 'Biopic') return 'Biopic'
  if (genre.indexOf('Comédie') > -1) return 'Comedy'
  if (genre === 'Documentaire') return 'Documentary'
  if (genre === 'Drama' || genre === 'Drame' || genre === 'Comédie dramatique') return 'Drama'
  if (genre === 'Epouvante-horreur') return 'Horror'
  if (genre === 'Historique') return 'Historical'
  if (genre === 'Policier') return 'Crime'
  if (genre === 'Fantastique' || genre === 'Science Fiction' || genre === 'Science-Fiction') return 'Sci-Fi'
  if (genre === 'Spectacle') return 'Show'
  return genre
}

const scrapeTorrent9Details = movie => (
  new Promise(resolve => (
    cs.get(movie.torrent_source_url, async (err, res, body) => {
      console.log(`${whatTimeIsIt()} Torrent 9 scraping ${movie.torrent_source_url}...`)
      if (err) {
        console.log(`${whatTimeIsIt()} Scraping failed: an error occured (${JSON.stringify(err)}).`)
        return resolve(movie)
      }
      const description = $('.movie-information p', body).eq(-2).text()
      const cover = $('.movie-img img', body).attr('src')
      console.log(`${movie.torrent_source_url} -> ${$($('.btn-danger', body)[2]).attr('href')}`)
      const torrent = $($('.btn-danger', body)[2]).attr('href')
      if (torrent === undefined) return resolve({})
      const genres = $('.movie-information ul:nth-child(5) li:nth-child(3)', body).text().split(',')
      Object.assign(movie, {
        description,
        cover,
        genres: genres.map(genre => manualTranslationOfGenres(genre.trim())),
        torrent,
      })
      return resolve(movie)
    })
  ))
)

const scrapeTorrent9Page = page => (
  new Promise(resolve => (
    cs.get(`https://wvw.torrent9.uno/torrents_films.html,page-${page}`, (err, res, body) => {
      console.log(`${whatTimeIsIt()} Torrent 9 scraping page ${page}...`)
      if (err) {
        console.log(`${whatTimeIsIt()} Cannot scrape page ${page}: an error occured (${JSON.stringify(err)}).`)
        return resolve([])
      }
      const rows = $('tr', body)
      const torrents = []
      Object.keys(rows).forEach((row) => {
        if (_.get(rows[row], 'children[0].next.children[1].next.attribs.href') !== undefined) {
          const quality = getQualifyFromTitle(rows[row].children[1].children[2].attribs.title)
          const item = {
            title: beautifyTitle(rows[row].children[1].children[2].attribs.title),
            year: Number(getYearFromTorrentName(rows[row].children[1].children[2].attribs.title)),
            // torrent_source_url: `https://ww1.torrent9.uno/${rows[row].children[1].children[2].attribs.href}`,
            torrent_source_url: `${rows[row].children[1].children[2].attribs.href}`,
            language: getLanguageFromTitle(rows[row].children[1].children[2].attribs.title),
            seeds: parseInt(rows[row].children[5].children[0].children[0].data.trim(), 10),
            leechers: parseInt(rows[row].children[7].children[0].data.trim(), 10),
            size: {
              human_readable: rows[row].children[3].children[0].data.toUpperCase(),
              unix: getUnixSizeFromHumanReadableSize(rows[row].children[3].children[0].data),
            },
          }
          if (quality !== undefined) Object.assign(item, { quality })
          torrents.push(item)
        }
      })
      console.log(`${whatTimeIsIt()} ......... ${page} is scraped`)
      return resolve(torrents)
    })
  ))
)

const lineariseTorrent9Movies = (movies) => {
  const torrentsList = []
  const groupedTorrents = _.mapValues(
    _.groupBy(movies, 'title'),
    clist => clist.map(torrent => _.omit(torrent, 'title'))
  )
  Object.keys(groupedTorrents).forEach((group) => {
    const torrentsData = []
    groupedTorrents[group].forEach((subgroup) => {
      const item = {
        source: 'torrent9',
        torrent: subgroup.torrent,
        language: groupedTorrents[group][0].language,
        seeds: subgroup.seeds,
        leechers: subgroup.leechers,
        size: {
          human_readable: subgroup.size.human_readable,
          unix: subgroup.size.unix,
        },
      }
      if (subgroup.quality !== undefined) Object.assign(item, { quality: subgroup.quality })
      torrentsData.push(item)
    })
    torrentsList.push({
      title: group,
      description: groupedTorrents[group][0].description,
      cover: groupedTorrents[group][0].cover,
      genres: groupedTorrents[group][0].genres,
      year: Number(groupedTorrents[group][0].year),
      torrents: torrentsData,
    })
  })
  return torrentsList
}

const scrapeTorrent9 = async () => {
  let currentPage = 1
  const numberOfPages = await scrapeNumberOfPages()
  const movies = []
  do {
    if (currentPage % 15 === 0) sleep(1000)
    const moviesList = await timeoutPromise(20000, scrapeTorrent9Page(currentPage), []) // eslint-disable-line
    if (!isEmpty(moviesList)) {
      await Promise.all(moviesList.map(movie => timeoutPromise(20000, scrapeTorrent9Details(movie), {}))) // eslint-disable-line
      movies.push(...moviesList)
    }
    currentPage += 1
  } while (currentPage <= numberOfPages)
  return lineariseTorrent9Movies(movies)
}

module.exports = scrapeTorrent9
