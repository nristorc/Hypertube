const MovieModel = require('../../src/models/movies.model')

const clear = async () => {
  const movies = await MovieModel.find({})
  movies.forEach(async (movie, index) => {
    movie.torrents = movie.torrents.filter(torrent => torrent.seeds > 20) // eslint-disable-line
    if (movie.torrents.length === 0) {
      await MovieModel.deleteOne({ _id: movie._id })
      console.log(`Index ${index} deleted`)
    } else {
      try {
        await MovieModel.findOneAndUpdate({ _id: movie._id },
          { $set: { torrents: movie.torrents } }, { new: true })
      } catch (e) {
        console.log('BDD Error:', e.message)
      }
      console.log(`Index ${index} updated`)
    }
  })
}

clear()
