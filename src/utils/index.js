const camelToTokens = str => {
  return str.split(/(?=[A-Z])/)
}

const withDefault = (object, defaultValue) => new Proxy(object, { 
  get(target, name) {
    return target[name] ? Reflect.get(target, name) : defaultValue;
  }
})

module.exports = { camelToTokens, withDefault }