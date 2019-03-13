const localStorage = require('localStorage')
const config = require('../config')

class FetchInterfaceService {
  constructor(host = config.API_HOST, port = config.API_PORT) {
    this.baseUrl = `http://${host}:${port}`
    this.bearer = localStorage.getItem('bearerToken')
  }

  async sendRequest(url, options) {
    try {
      const resp = await fetch(this.baseUrl + url, options)
      const json = await resp.json()
      return json
    } catch (e) {
      console.log(`Bad response from ${url}`)
      return Promise.reject(new Error(`Bad response from ${url}`))
    }
  }

  put(url, params, headers = null) {
    const options = {
      method: 'PUT',
      headers: headers || { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    }
    const bearerStringify = localStorage.getItem('bearerToken')
    if (bearerStringify !== null) {
      try {
        const bearer = JSON.parse(bearerStringify)
        const bearerToken = bearer.accessToken || bearer.access_token
        options.headers.Authorization = `Bearer ${bearerToken}`
      } catch (e) {
        localStorage.setItem('bearerToken', null)
      }
    }
    options.headers['cache-control'] = 'no-cache'
    return this.sendRequest(url, options)
  }

  delete(url, params, headers = null) {
    const options = {
      method: 'DELETE',
      headers: headers || { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    }
    const bearerStringify = localStorage.getItem('bearerToken')
    if (bearerStringify !== null) {
      try {
        const bearer = JSON.parse(bearerStringify)
        const bearerToken = bearer.accessToken || bearer.access_token
        options.headers.Authorization = `Bearer ${bearerToken}`
      } catch (e) {
        localStorage.setItem('bearerToken', null)
      }
    }
    options.headers['cache-control'] = 'no-cache'
    return this.sendRequest(url, options)
  }

  post(url, params, headers = null) {
    const options = {
      method: 'POST',
      headers: headers || { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    }
    const bearerStringify = localStorage.getItem('bearerToken')
    if (bearerStringify !== null) {
      try {
        const bearer = JSON.parse(bearerStringify)
        const bearerToken = bearer.accessToken || bearer.access_token
        options.headers.Authorization = `Bearer ${bearerToken}`
      } catch (e) {
        localStorage.setItem('bearerToken', null)
      }
    }
    options.headers['cache-control'] = 'no-cache'
    return this.sendRequest(url, options)
  }

  get(url, params = {}, headers = null) {
    const urlParams = Object.keys(params).length !== 0
      ? `${url}?${new URLSearchParams(params).toString()}`
      : url
    const options = {
      method: 'GET',
      headers: headers || this.headers || {},
      params,
    }
    const bearerStringify = localStorage.getItem('bearerToken')
    if (bearerStringify !== null) {
      try {
        const bearer = JSON.parse(bearerStringify)
        const bearerToken = bearer.accessToken || bearer.access_token
        options.headers.Authorization = `Bearer ${bearerToken}`
      } catch (e) {
        localStorage.setItem('bearerToken', null)
      }
    }
    options.headers['cache-control'] = 'no-cache'
    return this.sendRequest(urlParams, options)
  }
}

export default FetchInterfaceService
