import w from 'walax'
import m from 'mithril'
import Home from './home'
import Game from './game'
import Menu from './menu'
import Login from './login'

export default class Arena extends w.cls.Control {
  constructor () {
    super()
    this._game = null
    this._gameList = null
    this._cells = []
  }
  start () {
    document.body.innerHTML = '<div id="menu"></div> <div id="page"/>'
    m.mount(document.getElementById('menu'), Menu)
    m.route(document.getElementById('page'), '/home', {
      '/home': Home,
      '/game': Game,
      '/login': Login
    })
    let gameid = w.auth.storage.getItem('gameid')
    if (gameid) {
      this.game = Game.objects.get({ id: gameid })
    }
  }
  async getCurrentUser () {
    return w.net.get(`${w.apiBase}auth/user/`).then(user => {
      let obj = w.obj.receiveObject(w.obj.User, user)
      return obj
    })
  }
  async updateCells () {
    if (this.game) {
      w.obj.Cell.objects.filter({ game: this.game.id }).then(cells => {
        this._cells = cells
        m.redraw()
      })
    }
  }
  get cells () {
    return this._cells
  }
  get game () {
    return this._game
  }
  set game (game) {
    w.auth.storage.setItem('gameid', game.id)
    this._game = game
    this.updateCells().then(x => {
      m.route.set('/game')
    })
  }
  get gameList () {
    return this._gameList
  }
  toString () {
    return 'Arena'
  }
}
