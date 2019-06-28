import axios from '../../src'
interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}
interface User {
  name: string
  age: number
}
// 重载相关测试
axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'hello'
  }
})
function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(e => console.error(e) )
}
async function test() {
  const user = await getUser<User>()
  if (user) {
    console.log(user, user.result.name)
  }
}
test()
