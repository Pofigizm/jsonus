/* eslint-disable global-require */
import express from 'express'
import bodyParser from 'body-parser'
import jsdom from 'jsdom'

import { stateToHTML } from 'draft-js-export-html'
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  convertFromRaw,
} from 'draft-js'

const debug = require('debug')('jsonus:server')

global.document = jsdom.jsdom('<head></head>')
global.window = document.defaultView
global.HTMLElement = window.HTMLElement
global.HTMLAnchorElement = window.HTMLAnchorElement

// convert functions

const json2html = json => new Promise((res, rej) => {
  debug('json2html processing function')
  try {
    const sjson = {
      entityMap: {},
      ...json,
    }
    const html = stateToHTML(
      convertFromRaw(sjson),
    )
    res(html)
  } catch (err) {
    debug('json2html processing error:', err, json)
    rej()
  }
})

const html2json = html => new Promise((res, rej) => {
  debug('html2json processing function')
  try {
    const shtml = html.replace(/^\s*$/g, '&nbsp;')
    const json = convertToRaw(
      ContentState.createFromBlockArray(
        convertFromHTML(shtml),
      ),
    )
    res({
      ...json,
      blocks: json.blocks.map((el) => {
        const r = { ...el }
        delete r.key
        return r
      }),
    })
  } catch (err) {
    debug('html2json processing error:', err, html)
    rej()
  }
})

// http server

const app = express()
const port = '8080'

app.post('/tohtml', bodyParser.json(), (req, res) => {
  json2html(req.body)
    .then(r => res.status(200).send(r))
    .catch(() => res.status(400).send('Wrong body'))
})

app.post('/tojson', bodyParser.text(), (req, res) => {
  html2json(req.body)
    .then(r => res.status(200).send(r))
    .catch(() => res.status(400).send('Wrong body'))
})

app.use(express.static('static'))

app.listen(port, (error) => {
  if (error) {
    debug('HTTP listen error', error)
  } else {
    debug(`HTTP listen on port:${port}`)
  }
})
