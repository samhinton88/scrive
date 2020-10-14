const { TYPES } = require('./language-parts');

const NAME_MAPPING = TYPES.reduce(
  (acc, t) => ({ ...acc, [t.toLowerCase()]: t }),
  {}
);

module.exports = { NAME_MAPPING };
