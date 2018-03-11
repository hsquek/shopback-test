var should = require('chai').should()
var chai = require('chai')
var _ = require('lodash')
var Checker = require('../Checker.js')

describe('._exceeds', function () {
  it('Should accept a valid HTML filepath', function (done) {
    (function () {
      new Checker('./README.md')
    }).should.throw(Error)
    done()
  })
})

describe('._exceeds', function () {
  it('Should show an error if maximum count is exceeded', function (done) {
    var checker = new Checker('./test/scenarios/fail-exceed.html')
    checker._exceeds('.para-test', 2)
    checker.errors['.para-test'].should.equal('There should not be more than 2 <.para-test> tag(s). Count: 4')
    done()
  })
})

describe('._exists', function () {
  it('Should show an error if selector is not found', function (done) {
    var checker = new Checker('./test/scenarios/fail-exist.html')
    checker._exists('div')
    checker.errors['div'].should.equal('<div> not found')
    done()
  })
})

describe('._hasMissingAttribute', function () {
  it('Should show an error if selector does not have a specific attribute declared or has empty attribute', function (done) {
    var checker = new Checker('./test/scenarios/fail-missingAttribute.html')
    checker._hasMissingAttribute('meta', 'content')
    checker.errors['meta'].should.equal('<meta> without content attribute or has empty content attribute: 1')
    done()
  })
})

describe('.inspectTitle', function () {
  it('Should show an error if page does not have a title', function (done) {
    var checker = new Checker('./test/scenarios/fail-title.html')
    checker.inspectTitle()
    checker.errors['head title'].should.equal('<title> not found')
    done()
  })
})

describe('.inspectMeta', function () {
  it('Should show an error if names on meta tags are not properly filled in', function (done) {
    var checker = new Checker('./test/scenarios/fail-meta.html')
    checker.inspectMeta()
    checker.errors['meta'].should.be.an.instanceof(Array)
    checker.errors['meta'][0].should.equal('<meta name="keywords"... > not found in <head>')
    done()
  })

  it('Should be able to take in an array of additional names', function (done) {
    var checker = new Checker('./test/scenarios/fail-meta.html')
    checker.inspectMeta(['robots'])
    checker.errors['meta'][1].should.equal('<meta name="robots"... > not found in <head>')
    done()
  })
})

describe('.inspectH1', function () {
  it('Should show an error if page has more than one <h1> tag', function (done) {
    var checker = new Checker('./test/scenarios/fail-h1.html')
    checker.inspectH1()
    checker.errors['h1'].should.equal('There should not be more than 1 <h1> tag(s). Count: 2')
    done()
  })
})

describe('.inspectStrong', function () {
  it('Should show an error if page has more than 15 <strong> tags', function (done) {
    var checker = new Checker('./test/scenarios/fail-strong.html')
    checker.inspectStrong()
    checker.errors['strong'].should.equal('There should not be more than 15 <strong> tag(s). Count: 16')
    done()
  })

  it('Should be able to take in an additional parameter as maximum count', function (done) {
    var checker = new Checker('./test/scenarios/fail-strong.html')
    checker.inspectStrong(10)
    checker.errors['strong'].should.equal('There should not be more than 10 <strong> tag(s). Count: 16')
    done()
  })
})

describe('.inspectImages', function () {
  it('Should show an error if any <img> does not have alt attribute declared or has empty alt attribute', function (done) {
    var checker = new Checker('./test/scenarios/fail-img.html')
    checker.inspectImages()
    checker.errors['img'].should.equal('<img> without alt attribute or has empty alt attribute: 4')
    done()
  })
})

describe('.inspectAnchors', function () {
  it('Should show an error if any <a> does not have rel attribute declared or has empty rel attribute', function (done) {
    var checker = new Checker('./test/scenarios/fail-a.html')
    checker.inspectAnchors()
    checker.errors['a'].should.equal('<a> without rel attribute or has empty rel attribute: 2')
    done()
  })
})

describe('method chaining', function () {
  it('Should show an error if methods cannot be chained', function (done) {
    var checker = new Checker('./test/scenarios/fail-all.html')
    checker.inspectImages()
            .inspectAnchors()
            .inspectH1()
            .inspectStrong(5)
            .inspectTitle()
            .inspectMeta()
            ._hasMissingAttribute('meta', 'content')
            ._exists('.foo')
            ._exceeds('div', 1)
    var output = {
      img: '<img> without alt attribute or has empty alt attribute: 3',
      a: '<a> without rel attribute or has empty rel attribute: 2',
      h1: 'There should not be more than 1 <h1> tag(s). Count: 2',
      strong: 'There should not be more than 5 <strong> tag(s). Count: 16',
      'head title': '<title> not found',
      meta: '<meta> without content attribute or has empty content attribute: 2',
      '.foo': '<.foo> not found'
    }
    for (var key in output) {
      if (Array.isArray(checker.errors[key])) {
        checker.errors[key].forEach(function (msg, idx) {
          msg.should.equal(output[key][idx])
        })
      } else {
        checker.errors[key].should.equal(output[key])
      }
    }
    done()
  })

  it('Should return an empty error set if all rules were followed', function (done) {
    var checker = new Checker('./test/scenarios/pass-all.html')
    checker.inspectImages().inspectAnchors().inspectH1().inspectStrong(5).inspectTitle().inspectMeta()
    _.isEmpty(checker.errors).should.equal(true)
    done()
  })
})
