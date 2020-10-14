const Scrive = require('./src/scrive');
const handler = require('./src/handler');


const TYPES = [
  'Identifier'
].reduce((acc, t) => ({ ...acc, [t.toLowerCase()]: t }), {});

const defaultOperations = (arg) => ({
  Identifier: arg ?  (node) =>  namers.Identifier(node) === arg : () => true,
})

const namers = {
  Identifier: (path) => {
    return path.node.name;
  }
}

const COMPARATORS = {
  like: (str) => {}
}




const scrive = function (opts) { return new Proxy(new Scrive(opts), handler)};

module.exports = scrive;
