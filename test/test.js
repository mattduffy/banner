// import path from 'node:path'
// import { randomBytes } from 'node:crypto'
import {
  // after,
  before,
  describe,
  it,
} from 'node:test'
import assert from 'node:assert/strict'
// import fs from 'node:fs/promises'
import os from 'node:os'
import { Banner } from '../src/index.js'

/* eslint-disable camelcase */
const skip = { skip: true }
console.log(skip)
let cfg
let ctx
let ctx_POST
let ctx_GET
let ctx_PUT
let ctx_DEL
let next
describe('First test suite for banner package', async () => {
  before(() => {
    function getLocalIpAddress() {
      const networkInterfaces = os.networkInterfaces()
      let localIpAddress = null

      /* eslint-disable no-restricted-syntax */
      /* eslint-disable guard-for-in */
      for (const interfaceName in networkInterfaces) {
        const networkInterface = networkInterfaces[interfaceName]
        for (const details of networkInterface) {
          // Check for IPv4, not internal (loopback), and a valid address
          if (details.family === 'IPv4' && !details.internal) {
            localIpAddress = details.address
            break // Found a suitable IPv4 address, exit inner loop
          }
        }
        if (localIpAddress) {
          break // Found a suitable IPv4 address, exit outer loop
        }
      }
      return localIpAddress
    }
    ctx = {
      request: {
        ip: getLocalIpAddress(),
        protocol: 'https',
        method: '',
        url: '/a/really/long/url/to/a/special/page',
        header: {
          host: 'banner.test',
          referer: 'https://googoogle.com',
        },
      },
    }
    next = async (m) => {
      setTimeout(() => {
        console.log(`the next(${m}) function`)
      }, 1000)
    }
    cfg = {
      name: 'Banner Test #1',
      public: 'https://banner.test',
      local: 'http://banner.local',
      localPort: 8921,
    }
  })

  it('Should create a start-up banner instance with no constructor paramater given.', () => {
    const banner = new Banner()
    assert(banner instanceof Banner)
  })

  it('Should create a start-up banner instance, with constructor param.', () => {
    const banner = new Banner(cfg)
    assert(banner.bannerText.length > 0)
    assert(typeof banner.bannerText === 'string')
  })

  it('Should fail', () => {
    const banner = new Banner()
    assert(!banner.print())
  })

  it('Should work as a koajs middleware function - POST method.', async () => {
    // ctx_POST = Object.assign({}, ctx)
    ctx_POST = { ...ctx }
    ctx_POST.request.method = 'POST'
    ctx_POST.throw = (code, err) => {
      throw new Error(`${code}, ${err}`)
    }
    console.log(ctx_POST)
    const post = new Banner(ctx_POST)
    assert(await post.use()(ctx_POST, next))
  })

  it('Should work as a koajs middleware function - GET method.', async () => {
    // ctx_GET = Object.assign({}, ctx)
    ctx_GET = { ...ctx }
    ctx_GET.request.method = 'GET'
    ctx_GET.throw = (code, err) => {
      throw new Error(`${code}, ${err}`)
    }
    console.log(ctx_GET)
    const get = new Banner(ctx_GET)
    assert(await get.use()(ctx_GET, next))
  })

  it('Should work as a koajs middleware function - PUT method.', async () => {
    // ctx_PUT = Object.assign({}, ctx)
    ctx_PUT = { ...ctx }
    ctx_PUT.request.method = 'PUT'
    ctx_PUT.throw = (code, err) => {
      throw new Error(`${code}, ${err}`)
    }
    console.log(ctx_PUT)
    const put = new Banner(ctx_PUT)
    assert(await put.use()(ctx_PUT, next))
  })

  it('Should work as a koajs middleware function - DELETE method.', async () => {
    // ctx_DEL = Object.assign({}, ctx)
    ctx_DEL = { ...ctx }
    ctx_DEL.request.method = 'DELETE'
    ctx_DEL.throw = (code, err) => {
      throw new Error(`${code}, ${err}`)
    }
    console.log(ctx_DEL)
    const del = new Banner(ctx_DEL)
    assert(await del.use()(ctx_DEL, next))
  })

  it('Should fail as a koajs middleware function, missing input parameters.', async () => {
    ctx.request.header.host = null
    ctx.request.url = null
    ctx.throw = (code, err) => {
      // console.log(err.message)
      throw err
    }
    console.log(ctx)
    const req = new Banner()
    const use = await req.use()
    assert.rejects(
      async () => {
        await use(ctx)
      },
      Error,
    )
  })
})
