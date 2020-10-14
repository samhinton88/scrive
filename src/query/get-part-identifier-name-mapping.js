const { withDefault } = require('../utils');

const getPartIdentifierNameMapping = {
  Identifier: (path) =>  path.node.name,
  ArrowFunctionExpression: (path) => path.parent.id && path.parent.id.name
}

const defaultOperations = (arg) => withDefault({
  Identifier: arg ?  (node) =>  getPartIdentifierNameMapping.Identifier(node) === arg : () => true,
  ArrowFunctionExpression: arg ?  (node) =>  getPartIdentifierNameMapping.ArrowFunctionExpression(node) === arg : () => true,
}, () => true)

module.exports = { getPartIdentifierNameMapping, defaultOperations };
