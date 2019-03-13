const cs = require('cloudscraper')
const _ = require('lodash')
const { isEmpty, whatTimeIsIt } = require('../../src/utils')
const { TMDB_API_KEY } = require('../../src/config/config')

const getGenresFromGenreIds = (genreIds) => {
  const genres = []
  genreIds.forEach((genreId) => {
    if (genreId === 28) genres.push('Action')
    else if (genreId === 12) genres.push('Aventure')
    else if (genreId === 16) genres.push('Animation')
    else if (genreId === 35) genres.push('Comedy')
    else if (genreId === 80) genres.push('Crime')
    else if (genreId === 99) genres.push('Documentary')
    else if (genreId === 18) genres.push('Drama')
    else if (genreId === 107) genres.push('Family')
    else if (genreId === 14) genres.push('Fantasy')
    else if (genreId === 36) genres.push('History')
    else if (genreId === 27) genres.push('Horror')
    else if (genreId === 104) genres.push('Music')
    else if (genreId === 964) genres.push('Mystery')
    else if (genreId === 107) genres.push('Romance')
    else if (genreId === 878) genres.push('Science Fiction')
    else if (genreId === 107) genres.push('TV Movie')
    else if (genreId === 53) genres.push('Thriller')
    else if (genreId === 107) genres.push('War')
    else if (genreId === 37) genres.push('Western')
  })
  return genres
}

const findBestResult = (movie, results) => (
  _.find(
    results,
    result => (
      result.original_title.toLowerCase() === movie.title.toLowerCase() || (movie.title.indexOf('(') > -1
      && (result.original_title.toLowerCase() === movie.title.match(/\(([^)]+)\)/)[1].toLowerCase()
      || result.original_title.toLowerCase() === movie.title.split('(')[0].trim().toLowerCase()))
    )
  )
)

const scrapeTheMovieDatabase = movie => (
  new Promise(resolve => (
    cs.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${movie.title.split('(')[0].trim()}&language=en&page=1`, (err, res, body) => {
      console.log(`${whatTimeIsIt()} Scraping for ${movie.title.split('(')[0].trim()} [https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${movie.title.split('(')[0].trim()}&language=en&page=1]`)
      if (err) {
        console.log(`${whatTimeIsIt()} An error occured: ${JSON.stringify(err)}`)
        return resolve(movie)
      }
      const { results } = JSON.parse(body)
      const bestResult = findBestResult(movie, results)
      if (isEmpty(bestResult)) {
        if (movie.title.indexOf('(') > -1) {
          console.log(`${whatTimeIsIt()} No match for ${movie.title} [${movie.title.match(/\(([^)]+)\)/)[1].toLowerCase()} | ${movie.title.split('(')[0].trim().toLowerCase()}]`)
        } else console.log(`${whatTimeIsIt()} No match for ${movie.title}`)
        if (!isEmpty(results)) {
          results.forEach((result) => {
            console.log(`${whatTimeIsIt()} .... ${JSON.stringify(result)}`)
          })
        }
        return resolve(movie)
      }
      const title = bestResult.title || bestResult.original_title
      Object.assign(movie, {
        title,
        description: bestResult.overview,
        cover: `https://image.tmdb.org/t/p/w300${bestResult.poster_path}`,
        genres: getGenresFromGenreIds(bestResult.genre_ids),
        year: Number(bestResult.release_date.slice(0, 4)),
        rating: bestResult.vote_average,
        torrents: movie.torrents,
      })
      return resolve(movie)
    })
  ))
)

module.exports = scrapeTheMovieDatabase
