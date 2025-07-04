// import path from 'node:path'
// import { randomBytes } from 'node:crypto'
import {
  after,
  before,
  describe,
  it,
} from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { Banner } from '../src/index.js'
const skip = { skip: true }
let cfg
let ctx
let ctx_POST
let ctx_GET
let next
console.log(skip)
describe('First test suite for banner package', async () => {
  before(() => {
    ctx = {
      request: {
        method: '',
        url: '/a/really/long/url/to/a/special/page',
        header: {
          host: 'https://banner.test',
          referer: 'https://googoogle.com',
        },
      },
      throw: (code, msg) => {
        throw new Error(`Error code ${code}: ${msg}`)
      }
    }
    ctx_POST = { ...ctx }
    ctx_GET = { ...ctx }
    next = async () => {
      setTimeout(() => {
        console.log('the next() function')
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

  it('Should work as a koajs middleware function.', async () => {
    ctx_POST = Object.assign(ctx_POST, ctx)
    ctx_POST.request.method = 'POST'
    console.log(ctx_POST)
    const post = new Banner(ctx_POST)
    assert(await post.use()(ctx, next))

    ctx_GET = Object.assign(ctx_GET, ctx)
    ctx_GET.request.method = 'GET'
    console.log(ctx_GET)
    const get = new Banner(ctx_GET)
    assert(await get.use()(ctx, next))
  })

  it('Should fail as a koajs middleware function, missing input parameters.', async () => {
    ctx.url= ''
    ctx.request.header.host = undefined 
    ctx.request.url = undefined 
    console.log(ctx)
    const post = new Banner()
    await post.use()(ctx, next)
    // assert.throws(await post.use()(ctx, next))
  })
})
