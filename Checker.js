const fs = require('fs')
const cheerio = require('cheerio')
const _ = require('lodash')

function Checker (pathToHTML) {
  if (pathToHTML.split('.').pop() !== 'html') {
    throw new Error('Please provide a valid HTML filepath')
  }
  var html = fs.readFileSync(pathToHTML, 'utf8')
  this.content = cheerio.load(html)
  this.errors = {}
}

Checker.prototype.inspectTitle = function () {
  this._exists('head title')

  return this
}

Checker.prototype.inspectMeta = function (extraNames = []) {
  var $ = this.content
  var meta = $('head meta')
  var defaults = ['description', 'keywords']
  var requiredNames = defaults.concat(extraNames)
  var existingNames = {}
  var errors = this.errors

  meta.each(function (idx, ele) {
    var currentName = $(this).attr('name')

    if (!existingNames[currentName]) {
      existingNames[currentName] = currentName
    }
  })

  requiredNames.forEach(function (name) {
    if (!existingNames[name]) {
      errors = Object.assign(errors, {
        meta: errors.meta ? errors.meta.concat(['<meta name="' + name + '"... > not found in <head>'])
                            : [].concat(['<meta name="' + name + '"... > not found in <head>'])
      })
    }
  })

  return this
}

Checker.prototype.inspectImages = function () {
  this._hasMissingAttribute('img', 'alt')

  return this
}

Checker.prototype.inspectAnchors = function () {
  this._hasMissingAttribute('a', 'rel')

  return this
}

Checker.prototype.inspectH1 = function () {
  this._exceeds('h1', 1)

  return this
}

Checker.prototype.inspectStrong = function (n = 15) {
  this._exceeds('strong', n)

  return this
}

Checker.prototype._hasMissingAttribute = function (selector, attribute) {
  var $ = this.content
  var elements = $(selector)
  var tag = selector.split(' ').slice(-1)[0]
  var count = 0
  var errors = this.errors

  elements.each(function (idx, ele) {
    if (!$(this).attr(attribute)) {
      count++
    }
  })

  if (count >= 1) {
    errors = Object.assign(errors, {
      [selector]: '<' + tag + '> without ' + attribute + ' attribute or has empty ' + attribute + ' attribute: ' + count
    })
  }

  return this
}

Checker.prototype._exists = function (selector) {
  var $ = this.content
  var elements = $(selector)
  var tag = selector.split(' ').slice(-1)[0]
  var errors = this.errors

  if (!elements.length) {
    errors = Object.assign(errors, {
      [selector]: '<' + tag + '>' + ' not found'
    })
  }

  return this
}

Checker.prototype._exceeds = function (selector, maxCount) {
  var $ = this.content
  var elements = $(selector)
  var tag = selector.split(' ').slice(-1)[0]
  var errors = this.errors

  if (elements.length > maxCount) {
    errors = Object.assign(errors, {
      [selector]: 'There should not be more than ' + maxCount + ' <' + tag + '> tag(s). Count: ' + elements.length
    })
  }

  return this
}

Checker.prototype.report = function () {
  var errors = this.errors

  for (var key in errors) {
    console.log('\x1b[34m', key)
    if (Array.isArray(errors[key])) {
      errors[key].forEach(function (statement) {
        console.log('\x1b[31m', '  -> ' + statement)
      })
    } else {
      console.log('\x1b[31m', '  -> ' + errors[key])
    }
  }

  if (_.isEmpty(errors)) {
    console.log('All tests passed')
  }

  return this
}

module.exports = Checker
