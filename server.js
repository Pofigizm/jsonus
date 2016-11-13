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

const json2html = (json) => {
  debug('json2html processing function')
  const html = stateToHTML(
    convertFromRaw(json),
  )
  return html
}

const html2json = (html) => {
  debug('html2json processing function')
  const json = convertToRaw(
    ContentState.createFromBlockArray(
      convertFromHTML(html),
    ),
  )
  return {
    ...json,
    blocks: json.blocks.map((el) => {
      const res = { ...el }
      delete res.key
      return res
    }),
  }
}

// http server

const app = express()
const port = '8080'

app.post('/tohtml', bodyParser.json(), (req, res) => {
  if (typeof req.body !== 'object') {
    debug('Wrong body type of /tohtml')
    res.status(400).send('Wrong body type')
    return
  }

  res.status(200).send(json2html(req.body))
})

app.post('/tojson', bodyParser.text(), (req, res) => {
  if (typeof req.body !== 'string') {
    debug('Wrong body type of /tojson')
    res.status(400).send('Wrong body type')
    return
  }

  res.status(200).send(html2json(req.body))
})

app.all('*', (req, res) => {
  res.status(404).end()
})

app.listen(port, (error) => {
  if (error) {
    debug('HTTP listen error', error)
  } else {
    debug(`HTTP listen on port:${port}`)
  }
})
