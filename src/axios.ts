import { AxiosInstance, AxiosRequestConfig, AxoisStatic } from './types'
import defaults from './default'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'
function createInstance(config: AxiosRequestConfig): AxoisStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxoisStatic
}
const axios = createInstance(defaults)
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
export default axios
