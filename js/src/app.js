import regeneratorRuntime from 'regenerator-runtime'
import w from 'walax'
import m from 'mithril'
import { observable } from 'mobx'
import Arena from './arena'

let url = '/api/'
let prop = 'arena'

w.addPlugin(Arena)

Promise.resolve(w.load(prop, url)).then(x => {
  console.log('-----------------------------ARENA---------------------------')
  w.sleep(500).then(x => {
    w.arena.start()
  })
})
