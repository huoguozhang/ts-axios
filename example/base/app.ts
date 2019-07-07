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
  },
  transformRequest: [
    function(data, headers) {
      // Do whatever you want to transform the data

      return data
    }
  ],

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [
    function(data) {
      // Do whatever you want to transform the data
      return data
    }
  ]
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
