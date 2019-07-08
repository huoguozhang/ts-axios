import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/extend/get', {
  cancelToken: source.token
}).catch(function(e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message)
  }
})
setTimeout(() => {
   source.cancel('Operation canceled by the user.')
 source.cancel('Operation canceled by the useraaaa.')
  axios.post('/extend/post', { a: 1 }, { cancelToken: source.token }).catch(function(e) {
    if (axios.isCancel(e)) {
      console.log(e.message)
    }
  })
}, 100)

let cancel: Canceler

axios.get('/extend/get', {
  cancelToken: new CancelToken(c => {
    cancel = c
  })
}).catch(function(e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled')
  }
})

setTimeout(() => {
  cancel()
}, 200)
