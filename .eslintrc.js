// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow no unused variables
    "no-unused-vars": 0,
    // allow semicolons 
    "semi": 0,
    // allow multiple empty lines
    "no-multiple-empty-lines": 0,
    // allow arbitrary indentation
    "indent": 0,
    // allow space before function parenthesis
    "space-before-function-paren": 0,
    // allow comma dangle
    "comma-dangle": 0,
    // allow trailing spaces
    "no-trailing-spaces": 0,
    // allow end of line 
    "eol-last": 0,
    // allow multiple spaces
    "no-multi-spaces": 0
  }
}
