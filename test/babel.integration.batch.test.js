const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { TYPES } = require('../src/query/language-parts');

const scrive = require('..');

const code = '';


const _parser = (code) => parser.parse(code, {
  allowImportExportEverywhere: true,
  plugins: ["jsx", "classProperties", "typescript"],
})

describe('babel type definitions', () => {
  describe('when accessed by both plural and singular versions', () => {
    let scrivener;
  
    beforeEach(() => {
      scrivener = scrive({ parser: _parser, code, traverse });
    })
  
    it.each(TYPES)('%s should play nice', (type) => {
      const singularMethodName = `${type[0].toLowerCase()}${type.slice(1)}`;
      const pluralMethodName = singularMethodName.endsWith('s') ? singularMethodName : singularMethodName + 's'
      
      expect(() => scrivener[singularMethodName]('', () => {})).not.toThrow()
      expect(() => scrivener[pluralMethodName]('', () => {})).not.toThrow()
    })
  })
})