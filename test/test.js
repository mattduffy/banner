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
let ctx
let ctx_POST
let ctx_GET
let next
console.log(skip)
describe('First test for banner package', async () => {
  before(() => {
    ctx = {
      request: {
        method: '',
        url: '',
        header: {
          host: '',
          referer: '',
        },
      },
    }
    ctx_POST = { ...ctx }
    ctx_POST.request.method = 'POST'
    ctx_GET = { ...ctx }
    ctx_GET.request.method = 'GET'
    next = async () => {
      setTimeout(() => {
        console.log('the next() function')
      }, 1000)
    }
  })

  it('should create a start-up banner instance', () => {
    const cfg = {
      name: 'Banner Test #1',
      public: 'https://banner.test',
      local: 'http://banner.local',
      localPort: 8921,
    }
    const banner = new Banner(cfg)  
    assert(banner instanceof Banner)
  })
  
})
