import axios from '../../src/index'
axios.defaults.headers.common['xxx'] = 123
axios.defaults.headers.get['yyy'] = 333
axios({
  url: '/extend/post',
  method: 'post',
  data: {
    a: 1
  },
  headers: {
    test: '321'
  }
}).then((res) => {
  console.log(res.data)
})
axios({
  url: '/extend/get',
  method: 'get',
  data: {
    a: 1
  },
  headers: {
    test: '321'
  }
}).then((res) => {
  console.log(res.data)
})
axios({
  url: '/extend/delete',
  method: 'delete',
  data: {
    a: 1
  },
  headers: {
    test: '321'
  }
}).then((res) => {
  console.log(res.data)
})
window.axios = axios
