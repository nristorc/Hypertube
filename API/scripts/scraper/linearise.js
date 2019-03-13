const _ = require('lodash')
const { isEmpty } = require('../../src/utils')

const linearise = (ytsMovies, xMovies) => {
  if (isEmpty(ytsMovies) && isEmpty(xMovies)) return []
  if (isEmpty(xMovies)) return ytsMovies
  if (isEmpty(ytsMovies)) return xMovies
  ytsMovies.forEach((ytsMovie) => {
    const occurence = _.find(xMovies, el => el.title === ytsMovie.title)
    if (occurence) {
      if (!isEmpty(ytsMovie.torrents)) ytsMovie.torrents.push(...occurence.torrents)
      _.remove(xMovies, el => el.title === ytsMovie.title)
    }
  })
  ytsMovies.push(...xMovies)
  return ytsMovies
}

module.exports = linearise
