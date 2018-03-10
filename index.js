const fs = require('fs')
const path = require('path')
const Checker = require('./Checker.js')

var test = new Checker('./index.html')
test.inspectImages().inspectAnchors().inspectH1().inspectStrong(5).inspectTitle().inspectMeta().report()
