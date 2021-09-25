import regeneratorRuntime from 'regenerator-runtime'
import w from 'walax'
import m from 'mithril'
import { observable } from 'mobx'
import Arena from './arena'

let url = '/api/'
let prop = 'arena'

Promise.all([w.load(prop, url)])
w.addPlugin('arena', Arena)
console.log('-----------------------------ARENA---------------------------')
w.arena.start()
