const camelToTokens = str => {
  return str.split(/(?=[A-Z])/)
}

module.exports = { camelToTokens }