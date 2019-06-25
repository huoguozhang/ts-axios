import axios from '../../src/index'
const arr = new Int32Array([21, 31])
/*axios({
  method: 'post',
  url: '/base/post',
  headers: {
    'content-type': 'application/json;'
  },
  data: {
    a: 1,
    b: 2,
    arr
  }
})*/
axios({
  method: 'post',
  url: '/post',
  headers: {
    'content-type': 'application/json'
  },
  data: {
    a: 'zlj',
    b: 2,
    arr
  }
}).then(res => {
  console.log(res)
})
const paramsString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramsString)

/*axios({
  method: 'post',
  url: '/base/post',
  /!*headers: {
    'content-type': 'application/json;'
  },*!/
  data: searchParams
})*/
console.log('base')
