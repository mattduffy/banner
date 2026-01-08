/**
 * @module @mattduffy/banner
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @file src/index.js The Banner class definition file.
 */

import Debug from 'debug'

Debug.log = console.log.bind(console)
// const log = Debug('banner')
// const error = log.extend('ERROR')

/**
 * A class to create and emit a start-up banner of Koajs based apps.
 * @summary Create and emit an app start-up banner.
 * @class Banner
 * @author Matthew Duffy <mattduffy@gmail.com>
 */
export class Banner {
  #appName

  #arch

  #bannerText

  #borderGlyphGET = '#'

  #borderGlyphPUT = '&'

  #borderGlyphPOST = '@'

  #borderGlyphDELETE = '*'

  #ipAddress

  #lineStarts = []

  #lines = []

  #local

  #localPort

  #nodejs

  #nodeLts

  #nodeName

  #nodeVersion

  #platform

  #public

  #startingup

  /**
   * Create an instance of the Banner class.
   * @param { object } [strings] - An object literal of strings to display in the banner.
   * @param { string } [strings.ip] - The ip address of the request.
   * @param { string } strings.local - The local address the app is accessible at.
   * @param { Number } [strings.localPort] - The local address port, if provided.
   * @param { string } strings.name - The name of the app starting up.
   * @param { string } strings.public - The public web address the app is accesssible at.
   * @returns { Banner}
   */
  constructor(strings = null) {
    this.#arch = process.arch
    this.#nodeLts = process.release?.lts ?? null
    this.#nodeName = process.release.name
    this.#nodeVersion = process.version
    this.#platform = process.platform

    this.archLabel = 'arch'
    this.localLabel = 'local'
    this.nodejsLabel = 'process'
    this.publicLabel = 'public'
    this.startingupLabel = 'Starting up'

    if (strings) {
      this.#appName = strings.name
      this.#borderGlyphGET = strings?.borderGlyph ?? this.#borderGlyphGET
      this.#localPort = strings?.localPort ?? null
      this.#ipAddress = strings?.ip ?? null
      this.#local = `${strings.local}${(this.#localPort) ? `: ${this.#localPort}` : ''}`
      this.#public = strings.public
      this.#startingup = strings.name
    }

    if (this.#appName && this.#local && this.#public) {
      this.#compose()
    }
  }

  /**
   * Compose the inputs in to the banner text.
   * @throws { Error } - Throws an exception if name, public, local values are missing.
   * @return { void }
   */
  #compose() {
    if (!this.#appName || !this.#local || !this.#public) {
      throw new Error('Missing required inputs.')
    }
    this.startingupLine = `${this.startingupLabel}: ${this.#startingup}`
    this.#lineStarts.push(this.startingupLine)
    this.localLine = `${this.localLabel}: `
      + `${/^https?:\/\//.test(this.#local) ? `${this.#local}` : `http://${this.#local}`}`
    this.#lineStarts.push(this.localLine)
    this.publicLine = `${this.publicLabel}: `
      + `${/^https?:\/\//.test(this.#public) ? `${this.#public}` : `https://${this.#public}`}`
    this.#lineStarts.push(this.publicLine)
    this.archLine = `${this.archLabel}: ${this.#arch} ${this.#platform}`
    this.#lineStarts.push(this.archLine)
    this.nodejsLine = `${this.nodejsLabel}: ${this.#nodeName} ${this.#nodeVersion} `
      + `${(this.#nodeLts) ? `(${this.#nodeLts})` : ''}`
    this.#lineStarts.push(this.nodejsLine)

    this.startingupLine = this.startingupLine
      .padStart((this.longestLabel - this.startingupLine.indexOf(':'))
        + this.startingupLine.length, ' ')
    this.#lines[0] = this.startingupLine

    this.localLine = this.localLine
      .padStart((this.longestLabel - this.localLine.indexOf(':'))
        + this.localLine.length, ' ')
    this.#lines[1] = this.localLine

    this.publicLine = this.publicLine
      .padStart((this.longestLabel - this.publicLine.indexOf(':'))
        + this.publicLine.length, ' ')
    this.#lines[2] = this.publicLine

    this.nodejsLine = this.nodejsLine
      .padStart((this.longestLabel - this.nodejsLine.indexOf(':'))
        + this.nodejsLine.length, ' ')
    this.#lines[3] = this.nodejsLine

    this.archLine = this.archLine
      .padStart((this.longestLabel - this.archLine.indexOf(':'))
        + this.archLine.length, ' ')
    this.#lines[4] = this.archLine

    const g = this.#borderGlyphGET
    this.#bannerText = `${g}${g.padEnd(this.longestLine + 5, g)}${g}\n`
      + `${g}  ${' '.padEnd(this.longestLine + 2, ' ')} ${g}\n`
      + `${g} ${this.startingupLine}${' '
        .padEnd((this.longestLine - this.startingupLine.length) + 3, ' ')} ${g}\n`
        + `${g} ${this.localLine}${' '
          .padEnd((this.longestLine - this.localLine.length) + 3, ' ')} ${g}\n`
          + `${g} ${this.publicLine}${' '
            .padEnd((this.longestLine - this.publicLine.length) + 3, ' ')} ${g}\n`
            + `${g} ${this.nodejsLine}${' '
              .padEnd((this.longestLine - this.nodejsLine.length) + 3, ' ')} ${g}\n`
              + `${g} ${this.archLine}${' '
                .padEnd((this.longestLine - this.archLine.length) + 3, ' ')} ${g}\n`
      + `${g}  ${' '.padEnd(this.longestLine + 2, ' ')} ${g}\n`
      + `${g}${g.padEnd(this.longestLine + 5, g)}${g}\n`
  }

  /**
   * Emits the entire composed banner string through the console.log method.
   * @type { Boolean }
   * @return { Boolean } - True if #bannerText has content, otherwise false.
   */
  print() {
    if (this.#bannerText) {
      console.log(this.#bannerText)
      return true
    }
    return false
  }

  /**
   * Set the name of the app.
   * @type { string }
   * @param { string } name - The name of the app to display in the banner.
   */
  set name(name) {
    this.#appName = name
    this.#startingup = name
    if (this.#local && this.#public) {
      this.#compose()
    }
  }

  /**
   * Set the local address displayed in the banner.
   * @type { string }
   * @param { string } local - The local address displayed in the banner.
   */
  set local(local) {
    this.#local = `${local}${(this.#localPort) ? `:${this.#localPort}` : ''}`
    if (this.#appName && this.#public) {
      this.#compose()
    }
  }

  /**
   * Set the local address port displayed in the banner.
   * @type { string }
   * @param { string } port - The local address port displayed in the banner.
   */
  set localPort(port) {
    this.#localPort = port
    this.#local = `${this.#local}:${port}`
    if (this.#appName && this.#public) {
      this.#compose()
    }
  }

  /**
   * Set the public address displayed in the banner.
   * @type { string }
   * @param { string } glyph - The public address displayed in the banner.
   */
  set public(pub) {
    this.#public = pub
    if (this.#appName && this.#local) {
      this.#compose()
    }
  }

  /**
   * Set the border glyph of the banner.
   * @type { string }
   * @param { string } glyph - The border glyph character of the banner.
   */
  set borderGlyph(glyph) {
    this.#borderGlyphGET = glyph
    if (this.#appName && this.#local && this.#public) {
      this.#compose()
    }
  }

  /**
   * Return the entire composed banner as a string.
   * @type { string }
   * @return { string } - The composed banner as a string.
   */
  get bannerText() {
    return this.#bannerText
  }

  /**
   * Return the length of the longest line label as an int.
   * @type { number }
   * @return { number } - Length of the longest line label.
   */
  get longestLabel() {
    return this.#lineStarts.reduce((a, c) => {
      if (a > (c.indexOf(':') + 1)) {
        return a
      }
      return (c.indexOf(':') + 1)
    }, '')
  }

  /**
   * Return the length of the longest line of text as an int.
   * @type { number }
   * @return { number } - Length of the longest line of text.
   */
  get longestLine() {
    return this.#lines.reduce((a, c) => {
      if (a > c.length) {
        return a
      }
      return c.length
    }, '')
  }

  /**
   * Create a middleware method that generates a banner for each request.
   * @param { function } [Log] - an optional reference to the app level logging function.
   * @param { function } [Error] - an optional reference to the app level error logging function.
   * @returns { (ctx:object, next:function) => mixed } - Koa middleware function.
   */
  use(Log = null, Error = null) {
    const _log = Log ?? console.log
    // const _error = Error ?? console.error
    // _log('adding request banner to the app.')
    const gGET = this.#borderGlyphGET
    const gPUT = this.#borderGlyphPUT
    const gPOST = this.#borderGlyphPOST
    const gDEL = this.#borderGlyphDELETE
    // const n = this.#appName
    return async function banner(ctx, next = null) {
      let _requestBanner
      try {
        let _g
        switch (ctx.request.method.toLowerCase()) {
          case 'get':
            _g = gGET
            break
          case 'post':
            _g = gPOST
            console.info(ctx.request.body)
            break
          case 'put':
            _g = gPUT
            break
          case 'delete':
            _g = gDEL
            break
          default:
            _g = gGET
        }
        if (!ctx) {
          throw new Error('Missing required ctx object.')
        }
        if (!ctx.request.header.host) {
          throw new Error('Missing required request header.host value.')
        }
        if (!ctx.request.method) {
          throw new Error('Missing required request method value.')
        }
        if (!ctx.request.url) {
          throw new Error('Missing required request url value.')
        }
        const labels = []
        const values = []
        const lines = []
        const _urlLabel = `${ctx.request.method}:`
        labels.push(_urlLabel)
        let _url = `${ctx.request.protocol}://${ctx.request.header.host}${ctx.request.url}`
        const _queryStringIndex = _url.indexOf('?')
        const _queryStringLabel = 'Query Params:'
        let _queryString = ''
        let _queryStringLine = ''
        if (_queryStringIndex !== -1) {
          _queryString = _url.slice(_url.indexOf('?'))
          _queryStringLine = `${_queryStringLabel} ${_queryString}`
          labels.push(_queryStringLabel)
          values.push(_queryString)
          lines.push(_queryStringLine)
          // _log('adding query string to request banner')
        }
        _url = (_queryString.length > 0) ? _url.slice(0, _url.indexOf('?')) : _url
        values.push(_url)
        let _urlLine = `${_urlLabel} ${_url}`
        lines.push(_urlLine)
        const _refLabel = 'Referer:'
        labels.push(_refLabel)
        const _ref = ctx.request.header.referer ?? '<emtpy header field>'
        values.push(_ref)
        let _refLine = `${_refLabel} ${_ref}`
        lines.push(_refLine)
        const _ipLabel = 'From IP:'
        labels.push(_ipLabel)
        const _ip = ctx.request.ip
        values.push(_ip)
        let _ipLine = `${_ipLabel} ${_ip}`
        lines.push(_ipLine)
        let _locationLine = ''
        if (ctx?.state?.logEntry?.geos[0]) {
          // _log('banner geolocation says what?', ctx?.state?.logEntry)
          const l = ctx.state.logEntry.geos[0]
          const _locationLabel = 'Location:'
          labels.push(_locationLabel)
          /* eslint-disable prefer-template */
          const _location = `${(l.country) ? 'Country: ' + l.country + ', ' : ''}`
            + `${(l.subdivision) ? ((/united states|(usa)/i.test(l.country))
              ? 'State: ' : 'Subdivision: ') + l.subdivision + ', ' : ''}`
            + `${(l.city) ? 'City: ' + l.city + ', ' : ''}`
            + `${(l.coords) ? 'lat/lon: ' + l.coords[0] + ', ' + l.coords[1] : ''}`
          /* eslint-enable prefer-template */
          values.push(_location)
          _locationLine = `${_locationLabel} ${_location}`
          lines.push(_locationLine)
        }
        const _timestampLabel = 'Timestamp:'
        labels.push(_timestampLabel)
        const _timestamp = new Date().toLocaleString()
        values.push(_timestamp)
        let _timestampLine = `${_timestampLabel} ${_timestamp}`
        lines.push(_timestampLine)
        // _log(labels)
        // _log(values)
        // _log(lines)
        const _longestValue = values
          .reduce((a, c) => {
            if (a > c.length) return a
            return c.length
          }, '')
        // _log('longest value', _longestValue)

        const _longestLabel = labels
          .reduce((a, c) => {
            // _log(a, c.indexOf(':') + 1)
            if (a > (c.indexOf(':') + 1)) {
              return a
            }
            return (c.indexOf(':') + 1)
          }, '')
        // _log('longest label', _longestLabel)
        _refLine = _refLine.padStart(
          (_longestLabel - _refLine.indexOf(':')) + _refLine.length,
          ' ',
        )
        _urlLine = _urlLine.padStart(
          (_longestLabel - _urlLine.indexOf(':')) + _urlLine.length,
          ' ',
        )
        if (_queryStringLine.length > 0) {
          _queryStringLine = _queryStringLine.padStart(
            (_longestLabel - _queryStringLine.indexOf(':')) + _queryStringLine.length,
            ' ',
          )
        }
        _ipLine = _ipLine.padStart(
          (_longestLabel - _ipLine.indexOf(':')) + _ipLine.length,
          ' ',
        )
        if (_locationLine.length > 0) {
          _locationLine = _locationLine.padStart(
            (_longestLabel - _locationLine.indexOf(':')) + _locationLine.length,
            ' ',
          )
        }
        _timestampLine = _timestampLine.padStart(
          (_longestLabel - _timestampLine.indexOf(':')) + _timestampLine.length,
          ' ',
        )
        const _longestLine = _longestLabel + _longestValue
        // const _longestLine = lines
        //   .reduce((a, c) => {
        //     // _log(a, c.length)
        //     if (a > c.length) return a
        //     return c.length
        //   }, '')
        // _log('longest line', _longestLine)
        /* eslint-disable prefer-template */
        const endDangler = 6
        _requestBanner = `${_g.padEnd(_longestLine + endDangler, _g)}\n`
          + `${_g} ${_urlLine}\n`
          + `${(_queryStringLine.length > 0) ? _g + ' ' + _queryStringLine + '\n' : ''}`
          + `${_g} ${_refLine}\n`
          + `${_g} ${_ipLine}\n`
          + `${(_locationLine.length > 0) ? _g + ' ' + _locationLine + '\n' : ''}`
          + `${_g} ${_timestampLine}\n`
          + `${_g.padEnd(_longestLine + endDangler, _g)}`
        /* eslint-enable prefer-template */
        _log(_requestBanner)
        if (next) {
          await next(ctx.request.method)
        }
      } catch (e) {
        // _error('Failed after adding the request banner.')
        // _error(e)
        ctx.throw(500, e)
      }
      return _requestBanner
    } // end async closure function, Banner.use.banner()
  } // end Banner.use()
}
