// 获取并注册所有过滤器
const moduleFiles = require.context('./module', true, /\.js$/)
// console.log(moduleFiles.keys())

const modules = moduleFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = moduleFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export default modules
