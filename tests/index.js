require('babel-register')

const fixtures = require('./fixtures.json')
const { json2html, html2json } = require('../core')

const items = fixtures[0].result.items

Promise.all(items.map(item => html2json(item.body)
  .then(json2html)
  .then(res => `<div>${item.body}</div><div>${res}</div>`)
))
  .then((results) => {
    console.log(`<html><body>${results.join('')}</body></html>`)
  })
