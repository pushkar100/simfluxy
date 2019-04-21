const utils = {
    isObject(obj) {
        return obj instanceof Object && obj !== null && !(obj instanceof Array) && !(obj instanceof Function)
    },
    isFunction(fn) {
        return fn instanceof Function
    },
    isPromise(prom) {
        return typeof prom === "object" && prom !== null && typeof prom.then === 'function'
    },
    isString(str) {
        return typeof str === 'string'
    },
    isValidAction(action) {
        return typeof action === 'object' && typeof action.type === 'string'
    }
}

export default utils