const scrive = require('../scrive');

describe('identifier', () => {
  const node = { name: 'foo'};
  const mockAst = jest.fn();
  const mockVisitor = jest.fn();
  const mockPath = { node };

  let resultVisitor;
  const mockParser = (ast, visitor) => {
    mockAst(ast)
    resultVisitor = visitor;
    visitor.Identifier(mockPath)
  };
  let scrivener 


  beforeEach(() => {
    jest.restoreAllMocks()
    resultVisitor = {};
    scrivener = scrive(mockParser)
  });

  it('should send a visitor object to the parser with an Identifier key when given a callback', () => {
    scrivener.identifier('foo', () => {})
    expect(
      resultVisitor.Identifier
    ).toBeDefined();
  });

  it('should return the result of a query as the first argument of that callback', () => {
    scrivener.identifier('foo', (state) => {
      expect(state).toEqual([node])
    })

    scrivener.identifier('fo', (state) => {
      expect(state).toEqual([])
    })
  });

  describe('plurals', () => {
    it('should turn a term into a regex', () => {
      scrivener.identifiers()
    })
  })

  describe('like', () => {
    it('should turn a term into a regex', () => {
      scrivener.identifierLike('foo')
    })
  })
});

