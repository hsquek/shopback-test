const fs = require('fs')
const cheerio = require('cheerio')

function Checker (pathToHTML) {
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

Checker.prototype.inspectH1 = function (n = 1) {
  // var $ = this.content
  // var headers = $('h1')
  // var errors = this.errors
  //
  // if (headers.length > 1) {
  //   errors = Object.assign(errors, {
  //     'h1': 'There should not be more than 1 <h1> tag'
  //   })
  // }
  this._exceeds('h1', n)

  return this
}

Checker.prototype.inspectStrong = function (n = 15) {
  // var $ = this.content
  // var strong = $('strong')
  // var maxCount = n
  // var errors = this.errors
  //
  // if (strong.length > maxCount) {
  //   errors = Object.assign(this.errors, {
  //     'strong': 'There should not be more than ' + n + ' <strong> tag(s)'
  //   })
  // }
  this._exceeds('strong', n)

  return this
}

Checker.prototype._hasMissingAttribute = function (selector, attribute) {
  // see how you can make this better by using { selector: attrOfInterest }
  var $ = this.content
  var elements = $(selector)
  var tag = selector.split(' ').slice(-1)[0]
  var count = 0
  var errors = this.errors
  // var attrDictionary = {
  //   'img': 'alt',
  //   'a': 'rel'
  // }

  elements.each(function (idx, ele) {
    if (!$(this).attr(attribute)) {
      count++
    }
  })

  // var errDictionary = {
  //   'img': '<img> without alt attribute: ' + count,
  //   'a': '<a> without rel attribute: ' + count
  // }

  if (count >= 1) {
    errors = Object.assign(errors, {
      // [selector]: errDictionary[tag]
      [selector]: '<' + tag + '> without ' + attribute + ' attribute: ' + count
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
      [selector]: 'There should not be more than ' + maxCount + ' <' + tag + '> tag(s)'
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

  return this
}

module.exports = Checker
