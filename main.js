const { normalizeURL,getURLsFromHTML } = require('./crawl.js')
const inputURL = 'https://blog.boot.dev'
  const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>'
//   const actual = getURLsFromHTML(inputBody, inputURL)
console.log(normalizeURL(inputURL))