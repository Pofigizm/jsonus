import express from 'express'
import bodyParser from 'body-parser'

import { json2html, html2json } from './core'

const debug = require('debug')('jsonus:server')

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
