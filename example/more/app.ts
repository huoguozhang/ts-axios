import axios from '../../src/index'
const instance = axios.create({
  xsrfCookieName: 'XSRF-TOKEN-D',
  xsrfHeaderName: 'X-XSRF-TOKEN-D'
})

instance.get('/more/get', {
  // withCredentials: true
}).then(res => {
  console.log(res)
})
instance.post('http://localhost:8088/more/server2', {
  xxx: 'zzz'
}, {
  withCredentials: true
})
