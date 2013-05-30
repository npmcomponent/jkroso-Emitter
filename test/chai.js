
var chai = require('chai')

global.should = chai.should()

chai.Assertion.includeStack = true

module.exports = chai