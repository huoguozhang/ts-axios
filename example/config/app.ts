import axios from '../../src/index'
axios.defaults.headers.common['xxx'] = 123
axios.defaults.headers.get['yyy'] = 333
import qs from 'qs'
axios({
  transformRequest: [(function(data) {
    return data
  }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
    console.log(data, 'execute')
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }],
  url: '/extend/post',
  method: 'post',
  headers: {
    'content-type':　'application/json;charset=utf-8'
  },
  data: {
    a: 1
  }
}).then((res) => {
  console.log(res.data)
})
