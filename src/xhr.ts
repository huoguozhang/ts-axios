import { AxiosRequestConfig } from '../types'
export default function xhr(config: AxiosRequestConfig) {
  const { data, url, method } = config
  let request = new XMLHttpRequest()
  request.open('get', 'example.php', false)
  request.send(null)
}
