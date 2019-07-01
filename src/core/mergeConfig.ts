import { AxiosRequestConfig } from '../types'
// 默认合并策略
function defaultStrat(va11: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : va11
}
// 只接受自定义配置合并策略 url params data
function fromVal2Strat(va11: any, val2: any) {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
// 复杂对象合并策略: 如headers
function deepMergeStrat(val1: any, val2: any) {}
export default function mergeConfig(
  config1: AxiosRequestConfig, // default config
  config2?: AxiosRequestConfig // custom config
) {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)
  for (let key in config2) {
    mergeFild(key)
  }
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }
  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2[key])
  }
  return config
}
