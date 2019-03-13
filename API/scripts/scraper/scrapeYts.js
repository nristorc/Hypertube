const cs = require('cloudscraper')
const _ = require('lodash')
const { isEmpty, sleep, whatTimeIsIt } = require('../../src/utils')

const scrapeYtsNumberOfPages = () => (
  new Promise((resolve, reject) => (
    cs.get('https://yts.am/api/v2/list_movies.json?limit=50', (err, res, body) => {
      console.log(`${whatTimeIsIt()} YTS scraping number of pages...`)
      if (err) return reject(err)
      return resolve(Math.ceil(JSON.parse(body).data.movie_count / JSON.parse(body).data.limit))
    })
  ))
)

const scrapeYtsPage = page => (
  new Promise(resolve => (
    cs.get(`https://yts.am/api/v2/list_movies.json?page=${page}&limit=50`, (err, res, body) => {
      console.log(`${whatTimeIsIt()} YTS scraping page ${page}...`)
      if (err) {
        console.log(`${whatTimeIsIt()} Cannot scrape page ${page}: an error occured (${JSON.stringify(err)}).`)
        return resolve([])
      }
      const json = JSON.parse(body)
      const movies = []
      Object.keys(json.data.movies).forEach((movie) => {
        const torrents = []
        if (_.get(json.data.movies[movie], 'torrents') !== undefined) {
          Object.keys(json.data.movies[movie].torrents).forEach((torrent) => {
            torrents.push({
              source: 'yts',
              torrent: json.data.movies[movie].torrents[torrent].url,
              language: json.data.movies[movie].language.toUpperCase(),
              quality: `${json.data.movies[movie].torrents[torrent].type} ${json.data.movies[movie].torrents[torrent].quality}`,
              seeds: json.data.movies[movie].torrents[torrent].seeds,
              leechers: json.data.movies[movie].torrents[torrent].peers,
              size: {
                human_readable: json.data.movies[movie].torrents[torrent].size,
                unix: json.data.movies[movie].torrents[torrent].size_bytes,
              },
            })
          })
        }
        movies.push({
          title: json.data.movies[movie].title_english,
          description: json.data.movies[movie].synopsis,
          cover: json.data.movies[movie].medium_cover_image,
          genres: json.data.movies[movie].genres,
          year: Number(json.data.movies[movie].year),
          rating: Number(json.data.movies[movie].rating),
          torrents,
        })
      })
      console.log(`${whatTimeIsIt()} ......... ${page} is scraped`)
      return resolve(movies)
    })
  ))
)


const scrapeYts = async () => {
  let currentPage = 1
  const numberOfPages = await scrapeYtsNumberOfPages()
  // Uncomment the line below for testing purpose
  // const numberOfPages = 100
  const movies = []
  do {
    if (currentPage % 15 === 0) sleep(1000)
    const moviesList = await scrapeYtsPage(currentPage) // eslint-disable-line
    if (!isEmpty(moviesList)) movies.push(...moviesList)
    currentPage += 1
  } while (currentPage <= numberOfPages)
  return movies
}

module.exports = scrapeYts
