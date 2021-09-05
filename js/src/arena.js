import w from 'walax'
import m from 'mithril'
import Home from './home'
import Game from './game'
import Menu from './menu'
import Login from './login'

export default class Arena extends w.cls.Control {
    constructor() {
        super()
    }
    start() {
        document.body.innerHTML = '<div id="menu"></div> <div id="page"/>'
        m.mount(document.getElementById('menu'), Menu)
        m.route(document.getElementById('page'), '/home', {
            '/home': Home,
            '/game': Game,
            '/login': Login
        })
    }
    async getCurrentUser() {
        return w.net.get(`${w.apiBase}auth/user/`).then(user => {
            let obj = w.obj.receiveObject(w.obj.User, user)
            return obj
        })
    }
    get game () {
        return this._game
    }
    set game (game) {
        this._game = game
        m.route.set('/game')
    }
    toString() { return 'Arena' }
}