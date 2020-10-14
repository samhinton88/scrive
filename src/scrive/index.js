const { visitorFrom } = require('../query/visitor-from');
const { defaultOperations } = require('../query/get-part-identifier-name-mapping')



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

        const visitor = visitorFrom(lastQuery);
        
        this.traverse(this.parser(this.code), visitor)

        return this;
    }
  }

  overwrite() {
    let memo = this.parser(this.code);

    for (const q of this.queries) {
      this.traverse(memo, visitorFrom(q));
    }

    return this.generator(memo, { retainLines: true}).code
  }
}

module.exports = Scrive;