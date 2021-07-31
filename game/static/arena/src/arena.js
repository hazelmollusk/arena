import w from 'walax'
import m from 'mithril'
import View from './view'
import Mithril from 'mithril'

export default class Arena extends w.cls.Control {
    start() {
        m.mount(document.body, View)
    }
    toString() { return 'Arena' }
}