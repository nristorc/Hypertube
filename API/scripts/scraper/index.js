const scrapeYts = require('./scrapeYts')
const scrape1337X = require('./scrape1337X')
const linearise = require('./linearise')
const updateDatabase = require('./updateDatabase')
const { whatTimeIsIt } = require('../../src/utils')

const scrapeAndUpdateDatabase = async () => {
  console.log(`Scraping started at: ${new Date()}`)
  try {
    const ytsMovies = [...await scrapeYts()]
    const xMovies = [...await scrape1337X()]
    console.log(`${ytsMovies.length + xMovies.length} movies before linearisation`)
    const movies = await linearise(ytsMovies, xMovies)
    console.log(`${movies.length} movies after linearisation`)
    return updateDatabase(movies)
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

scrapeAndUpdateDatabase()
  .then(() => {
    console.log(`${whatTimeIsIt()}: update is now over`)
    process.exit() // eslint-disable-line
  })
  .catch((err) => {
    console.error('An error occured.')
    console.error(JSON.stringify(err))
    process.exit() // eslint-disable-line
  })
