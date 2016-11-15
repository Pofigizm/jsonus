import jsdom from 'jsdom'

import { stateToHTML } from 'draft-js-export-html'
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  convertFromRaw,
} from 'draft-js'

const debug = require('debug')('jsonus:core')

global.document = jsdom.jsdom('<head></head>')
global.window = document.defaultView
global.HTMLElement = window.HTMLElement
global.HTMLAnchorElement = window.HTMLAnchorElement

export const json2html = json => new Promise((res, rej) => {
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

export const html2json = html => new Promise((res, rej) => {
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
