import FetchInterfaceService from './fetchInterface.service'

const route = require('./route.service')

const apiFetch = new FetchInterfaceService()

const addTorrent = data => apiFetch.post(route.ADD_TORRENT, new URLSearchParams(data).toString())

const statusTorrent = data => apiFetch.get(route.STATUS_TORRENT, data)

export {
  addTorrent,
  statusTorrent,
}
