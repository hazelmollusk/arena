import regeneratorRuntime from "regenerator-runtime";
import w from 'walax'
import m from 'mithril'
import { observable } from 'mobx'
import Arena from './arena'

let url = '/api/'
let prop = 'arena'

w.load(prop, url).then(x => {
    w.addPlugin('arena', Arena)
    w.arena.start()
})
