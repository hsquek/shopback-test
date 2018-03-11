# SEO Checker

#### Find out if you're flouting any SEO rules

### Initialisation and Usage

```
const Checker = require('Checker')
var checker = new Checker(htmlFilePath)

checker.inspectTitle().inspectH1().report()
//  head title
//    -> <title> not found
//  h1
//    -> There should not be more than 1 <h1> tag(s). Count: 2
```

### API
__The following methods adhere to certain pre-defined SEO rules:__
##### .inspectTitle()
Logs an error if there is no `<title>` tag in the `<head>`.

##### .inspectMeta([[names]])
Logs an error if the requisite names for `<meta>` tags are not found.

```
// name defaults: ['keywords', 'description']
// takes in array of additional names

...
checker.inspectMeta(['foo'])
// meta
//   -> <meta name="keywords"... > not found in <head>
//   -> <meta name="foo"... > not found in <head>
```

##### .inspectH1()
Logs an error if there is more than one `<h1>` tag in the document.

##### .inspectImages()
Logs an error if `<img>` tags do not have `alt` attributes declared or if `alt` attributes are left empty.

##### .inspectAnchors()
Logs an error if `<a>` tags do not have `rel` attributes declared or if `rel` attributes are left empty.

##### .inspectStrong(maxCount = 15)
Logs an error if there are more than 15 (default) `<strong` tags.

```
...
checker.inspectStrong(5)
// strong
//   -> There should not be more than 5 <strong> tag(s). Count: 11
```
##### .report()
Print out logged errors in the terminal. Or view the error object with `checker.errors`.

```
img
  -> <img> without alt attribute or has empty alt attribute: 3
a
  -> <a> without rel attribute or has empty rel attribute: 2
h1
  -> There should not be more than 1 <h1> tag(s). Count: 2
strong
  -> There should not be more than 5 <strong> tag(s). Count: 11
head title
  -> <title> not found
meta
  -> <meta name="keywords"... > not found in <head>
```

##### __The next few methods allow you greater flexibility in defining your own rules.__

##### ._exists(selector)
Logs an error if selector is not found.
```
...
checker._exists('div')
// { 'div': '<div> not found' }
```


##### ._exceeds(selector, n)
Logs an error if n is exceeded.
```
...
checker._exceeds('.foo', 2)
// { '.foo': 'There should not be more than 2 <.foo> tag(s). Count: 4' }
```

##### ._hasMissingAttribute(selector, attribute)
Logs an error if selector does not have a specific attribute declared or has empty attribute
```
...
checker._hasMissingAttribute('div', 'class')
// { div: '<div> without class attribute or has empty class attribute: 1' }
```

### Tests
`npm test`


### Acknowledgements
[cheerio](https://github.com/cheeriojs/cheerio)
