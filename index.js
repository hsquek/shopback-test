const fs = require('fs')
const path = require('path')
const Checker = require('./Checker.js')

var test = new Checker('./index.html')
test.inspectTitle().inspectMeta(['robots']).inspectImages().inspectAnchors().inspectH1().inspectStrong(10).report()
