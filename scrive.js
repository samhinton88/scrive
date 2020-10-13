const { default: traverse } = require("@babel/traverse");

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

  constructor({ parser, generator, code, traverse }) {
    this.parser = parser;
    this.generator = generator;
    this.code = code;
    this.state=[];
    this.queries=[];
    this.traverse = traverse;
    this._protected = ['overwrite','_protected',...Object.keys(this)]
  }

  query(...args) {
    console.log('query', args)
    let lastQuery;

    switch (args.length) {
      case 1: 
        lastQuery = this.queries.pop();
        lastQuery.term = args[0];
        this.queries.push(lastQuery);

        return this;
      case 2: 
        const term = args[0];
        const callBack = args[1];
        lastQuery = this.queries[this.queries.length - 1];

        lastQuery.term = term;
        lastQuery.test = defaultOperations(term)[lastQuery.partType];
        lastQuery.callBack = callBack;

        const visitor = queryFrom(lastQuery);
        
        this.traverse(this.parser(this.code), visitor)
        console.log('returning self', lastQuery)
        return this;
    }
  }

  overwrite() {
    let memo = this.parser(this.code);
    console.log(`running ${this.queries.length} queries`)

    for (const q of this.queries) {
      this.traverse(memo, queryFrom(q));

    }
    return this.generator(memo, { retainLines: true}).code
  }
}

const camelToTokens = str => {
  return str.split(/(?=[A-Z])/)
}


const queryFrom = (config) => {
  let block = false;

  const visitor = {
    [config.partType](path) {
    
      if (block) return;
      if (!config.test(path)) return;
      config.callBack && config.callBack(path)

      if (!config.isPlural) block = true;
    }  
  }

  return visitor;
}

const handler = {
  get(target, name) {
    if (target._protected.includes(name) ) { 
      console.log('PROTECTED',name)
      return Reflect.get(target, name) 
    }
    console.log('get',  name)
    const tokens = camelToTokens(name);
    const firstToken = tokens[0];

    const isPlural = firstToken.endsWith('s');
    const lookup = isPlural ? firstToken.slice(0, -1) : firstToken;
    const partType = TYPES[lookup];
    console.log('push to q', partType)
    target.queries.push({ isPlural, partType });

    return target.query
  }
}

const scrive = function (opts) { return new Proxy(new Scrive(opts), handler)};

module.exports = scrive;
