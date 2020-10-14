const scrive = require('..')
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const testCode = `const { TestScheduler } = require("jest");

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

class Scrive {
  state=[];
  queries=[];

  constructor(parser) {
    this.parser = parser;
  }
}

const camelToTokens = str => {
  return str.split(/(?=[A-Z])/)
}

const functionHandler = {
  apply(target, thisObject, args) {
    let lastQuery;

    switch (args.length) {
      case 1: 
        lastQuery = thisObject.queries.pop();
        lastQuery.term = args[0];
        thisObject.queries.push(lastQuery);

        return thisObject;
      case 2: 
        const term = args[0];
        const callBack = args[1];
        lastQuery = thisObject.queries.pop();

        lastQuery.term = term;
        lastQuery.test = defaultOperations(term)[lastQuery.partType];

        thisObject.queries.push(lastQuery);

        thisObject.state.push(
          ...thisObject.queries.map(queryFrom).reduce((acc, [visitor, memo]) => {
            thisObject.parser(null, visitor)

            return [...acc, ...memo.state]
          },[])
        )

        callBack(thisObject.state);
        thisObject.state = [];
        thisObject.queries = []

        return thisObject;
    }
  }
}

const proxyFunction = new Proxy(function() {}, functionHandler);

const queryFrom = (config) => {
  const memo = { state: [] }

  const visitor = {
    [config.partType](path) {
    
      if (!config.test(path)) return;

      memo.state.push(path.node);

      if (!config.isPlural) return
    }  
  }

  return [visitor, memo]
}

const handler = {
  get(target, name) {
    const tokens = camelToTokens(name);
    const firstToken = tokens[0];

    const isPlural = firstToken.endsWith('s');
    const lookup = isPlural ? firstToken.slice(0, -1) : firstToken;
    const partType = TYPES[lookup];

    target.queries.push({ isPlural, partType });

    return (...args) => Reflect.apply(proxyFunction, target, args)
  }
}


const scrive = (parser) => new Proxy(new Scrive(parser), handler);



module.exports = scrive;
`

describe('integration with babel', () => {
  let scrivener;

  beforeEach(() => {
    const _parser = (code) => parser.parse(code, {
      allowImportExportEverywhere: true,
      plugins: ["jsx", "classProperties", "typescript"],
    })
  

    scrivener = scrive({ parser: _parser, generator: generate, code: testCode, traverse });
  })

  it('should run', () => {
    scrivener.identifier('scrive',(s) => {

      expect(s.node.name).toBe('scrive')})
  })

  it('should overwrite', () => {
    const text = scrivener
      .identifiers(
        'scrive',
        function (p) {
          p.node.name = 'goo'
        }
      ).overwrite();

    expect(text).toMatchSnapshot()
  });

  it('should overwrite with many queries', () => {
    const text = scrivener
      .identifiers(
        'scrive',
        (p) => {
          p.node.name = 'goo'
        }
      )
    
      .identifier('TYPES', (p) => p.node.name = 'lalalal')
      .overwrite();

    expect(text).toMatchSnapshot()
  })
})
