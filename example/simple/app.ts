import axios from '../../src/index'
axios({
  method: 'get',
  url: '/simple/get#home',
  params: {
    a: 1,
    b: 2
  }
})
