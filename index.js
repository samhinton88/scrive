const Scrive = require('./src/scrive');
const handler = require('./src/handler');

const scrive = function (opts) { return new Proxy(new Scrive(opts), handler)};

module.exports = scrive;
