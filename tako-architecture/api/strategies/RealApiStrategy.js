import { ApiContainer } from '../ApiContainer.js'

export class RealApiStrategy {
  request(endpoint, options = {}) {
    const api = ApiContainer.getInstance()
    const headers = {
      ...api.getHeaders(),
      ...(options.headers || {})
    }

    return fetch(api.baseURL + endpoint, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    }).then(res => res.json())
  }
}
