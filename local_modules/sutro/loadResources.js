import pluralize from 'pluralize'
import requireDir from 'require-dir'
import mapValues from 'lodash.mapvalues'
import map from 'lodash.map'
import omit from 'lodash.omit'
import methods from './methods'

const blacklist = ['model']
const getDefaultFn = (m) => m.__esModule ? m.default : m

export default (opt) => {
  const resources = requireDir(opt.path, {recurse: true})

  const getPath = (resourceName, methodName, methodInfo) => {
    var plural = pluralize.plural(resourceName)

    var path = `${opt.prefix}/${plural}`
    if (!methods[methodName]) {
      path += `/${methodName}`
    }
    if (methodInfo.instance) {
      path += '/:id'
    }

    return path
  }

  const getEndpoints = (handlers, resourceName) =>
    map(omit(handlers, blacklist), (handler, methodName) => {
      var fn = getDefaultFn(handler)
      if (typeof fn !== 'function') {
        throw new Error(`"${resourceName}" handler "${methodName}" did not export a function`)
      }
      var methodInfo = handler.http ? handler.http : methods[methodName]
      if (!methodInfo) {
        throw new Error(`"${resourceName}" handler "${methodName}" did not export a HTTP config object`)
      }
      if (typeof methodInfo.method === 'undefined') {
        throw new Error(`"${resourceName}" handler "${methodName}" did not export a HTTP config object containing "method"`)
      }
      if (typeof methodInfo.instance === 'undefined') {
        throw new Error(`"${resourceName}" handler "${methodName}" did not export a HTTP config object containing "instance"`)
      }

      return {
        name: methodName,
        method: methodInfo.method.toLowerCase(),
        path: getPath(resourceName, methodName, methodInfo),
        instance: !!methodInfo.instance,
        handler: fn,
        model: handlers.model
      }
    })

  return mapValues(resources, getEndpoints)
}
