const { camelToTokens } = require('../utils')
const { NAME_MAPPING } = require('../query/name-mappings')

const handler = {
  get(target, name) {
    if (target._protected.includes(name) ) { 
      return Reflect.get(target, name) 
    }

    const tokens = camelToTokens(name);
    const firstToken = tokens[0];

    const isPlural = firstToken.endsWith('s');
    const lookup = isPlural ? firstToken.slice(0, -1) : firstToken;
    const partType = NAME_MAPPING[lookup];

    target.queries.push({ isPlural, partType });

    return target.query
  }
}

module.exports = handler;