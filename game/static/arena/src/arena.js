import w from 'walax'
import m from 'mithril'
import Home from './home'
import Game from './game'
import Menu from './menu'
import Login from './login'

export default class Arena extends w.cls.Control {
    start() {
        document.body.innerHTML = '<div id="menu"></div> <div id="page"/>'
        m.mount(document.getElementById('menu'), Menu)
        m.route(document.getElementById('page'), '/home', {
            '/game': Game,
            '/home': Home,
            '/login': Login
        })
    }
    toString() { return 'Arena' }
}