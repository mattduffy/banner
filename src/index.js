/**
 * @module @mattduffy/banner
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @file src/index.js The Banner class definition file.
 */

import Debug from 'debug'

Debug.log = console.log.bind(console)
const log = Debug('banner')
const error = log.extend('ERROR')

/**
 * A class to create and emit a start-up banner of Koajs based apps.
 * @summary Create and emit an app start-up banner.
 * @class Banner
 * @author Matthew Duffy <mattduffy@gmail.com>
 */
export class Banner {
  #borderGlyph
  #startingup
  #local
  #localPort
  #public
  #arch
  #platform
  #nodejs
  #nodeName
  #nodeVersion
  #nodeLts
  #lineStarts = []
  #lines = []
  #bannerText
  /**
   * Create an instance of the Banner class.
   * @param { object } [strings] - An object literal of strings to display in the banner.
   * @param { string } strings.name - The name of the app starting up.
   * @param { string } strings.public - The public web address the app is accesssible at.
   * @param { string } strings.local - The local address the app is accessible at.
   * @param { Number } [strings.localPort] - The local address port, if provided.
   * @return { Banner}
   */
  constructor(strings=null) {
    if (!strings) {
      return null
    }
    this.#borderGlyph = strings?.borderGlyph ?? '#'
    this.#startingup = strings.name
    this.#localPort = strings?.localPort ?? null
    this.#local = `${strings.local}${(this.#localPort) ? ':' + this.#localPort : ''}`
    this.#public = strings.public
    this.#arch = process.arch
    this.#platform = process.platform
    this.#nodeName = process.release.name
    this.#nodeLts = process.release?.lts ?? null
    this.#nodeVersion = process.version

    this.startingupLabel = 'Starting up'
    this.localLabel = 'local'
    this.publicLabel = 'public'
    this.nodejsLabel = 'process'
    this.archLabel = 'arch'

    this.startingupLine = `${this.startingupLabel}: ${this.#startingup}`
    this.#lineStarts.push(this.startingupLine)
    this.localLine = `${this.localLabel}: `
      + `${/^https?:\/\//.test(this.#local) ? this.#local : 'http://' + this.#local}`
    this.#lineStarts.push(this.localLine)
    this.publicLine = `${this.publicLabel}: `
      + `${/^https?:\/\//.test(this.#public) ? this.#public : 'https://' + this.#public}`
    this.#lineStarts.push(this.publicLine)
    this.archLine = `${this.archLabel}: ${this.#arch} ${this.#platform}`
    this.#lineStarts.push(this.archLine)
    this.nodejsLine = `${this.nodejsLabel}: ${this.#nodeName} ${this.#nodeVersion} `
      + `${(this.#nodeLts) ? '(' + this.#nodeLts + ')' : ''}`
    this.#lineStarts.push(this.nodejsLine)

    this.startingupLine = this.startingupLine.padStart(
      (this.longestLabel - this.startingupLine.indexOf(':'))
      + this.startingupLine.length, ' ')
    this.#lines[0] = this.startingupLine

    this.localLine = this.localLine.padStart(
      (this.longestLabel - this.localLine.indexOf(':'))
      + this.localLine.length, ' ')
    this.#lines[1] = this.localLine

    this.publicLine = this.publicLine.padStart(
      (this.longestLabel - this.publicLine.indexOf(':'))
      + this.publicLine.length, ' ')
    this.#lines[2] = this.publicLine

    this.nodejsLine = this.nodejsLine.padStart(
      (this.longestLabel - this.nodejsLine.indexOf(':'))
      + this.nodejsLine.length, ' ')
    this.#lines[3] = this.nodejsLine

    this.archLine = this.archLine.padStart(
      (this.longestLabel - this.archLine.indexOf(':'))
      + this.archLine.length, ' ')
    this.#lines[4] = this.archLine

    const g = this.#borderGlyph
    this.#bannerText =
      `${g}${g.padEnd(this.longestLine + 5, g)}${g}\n`
      + `${g}  ${' '.padEnd(this.longestLine + 2, ' ')} ${g}\n`
      + `${g} ${this.startingupLine}${' '.padEnd(
        (this.longestLine - this.startingupLine.length) + 3, ' ')} ${g}\n`
      + `${g} ${this.localLine}${' '.padEnd(
        (this.longestLine - this.localLine.length) + 3, ' ')} ${g}\n`
      + `${g} ${this.publicLine}${' '.padEnd(
        (this.longestLine - this.publicLine.length) + 3, ' ')} ${g}\n`
      + `${g} ${this.nodejsLine}${' '.padEnd(
        (this.longestLine - this.nodejsLine.length) + 3, ' ')} ${g}\n`
      + `${g} ${this.archLine}${' '.padEnd(
        (this.longestLine - this.archLine.length) + 3, ' ')} ${g}\n`
      + `${g}  ${' '.padEnd(this.longestLine + 2, ' ')} ${g}\n`
      + `${g}${g.padEnd(this.longestLine + 5, g)}${g}\n`
  }

  print() {
    console.log(this.#bannerText)
  }

  get bannerText() {
    return this.#bannerText
  }

  get longestLabel() {
    return this.#lineStarts.reduce((a, c) => {
      if (a > (c.indexOf(':') + 1)) {
        return a
      }
      return (c.indexOf(':') + 1)
    }, '')
  }

  get longestLine() {
    return this.#lines.reduce((a, c) => {
      if (a > c.length) {
        return a
      }
      return c.length
    }, '')
  }

  use() {
    const _bannerText = this.#bannerText
    // log(_bannerText)
    return async function banner(ctx, next){
      console.log(_bannerText)
      try {
        // log('Emitting start-up banner')
        await next()
      } catch (e) {
        error('Failed after adding start-up banner.')
        error(e)
        ctx.throw(500, 'Error after adding start-up banner.', e)
      }
    }
  }
}
