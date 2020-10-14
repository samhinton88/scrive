const { camelToTokens } = require('../utils')
const { NAME_MAPPING } = require('../query/name-mappings');

const getLookup = str => {

  if (NAME_MAPPING[str.toLowerCase()]) return 
}

const nativePlurals = ['TSExpressionWithTypeArguments'].map(s => s.toLowerCase());

const handler = {
  get(target, name) {
    if (target._protected.includes(name) ) { 
      return Reflect.get(target, name) 
    }

    const tokens = camelToTokens(name);
    const lowerCaseName = name.toLowerCase();

    const isPlural = lowerCaseName.endsWith('s') 
      && !nativePlurals.includes(lowerCaseName);
      
    const lookup = isPlural ?
      lowerCaseName.slice(0, -1) : lowerCaseName;

    const partType = NAME_MAPPING[lookup];

    target.queries.push({ isPlural, partType });

    return target.query
  }
}

module.exports = handler;