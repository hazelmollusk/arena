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
    this._games = []
    this._cells = []
    this._creatures = []
    this._user = null
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
      return w.obj.Cell.objects.filter({ game: this.game.id }).then(cells => {
        this._cells = cells
      })
    }
    return undefined
  }
  async updateUser () {
    if (w.auth.state) {
      return this.getCurrentUser().then(u => {
        this._user = u
        return this._user
      })
    }
  }
  updateGameList () {
    this.i('refreshing game list')
    w.obj.Game.objects.all().then(x => {
      this._games = []
      x.forEach(g => {
        this._games.push(g)
      })
      m.redraw()
    })
  }
  async updateCreatures () {
    if (this.game) {
      return w.obj.Creature.objects.filter({ game: this.game.id }).then(c => {
        this.d('creatures', c)
        this._creatures = c
      })
    }
    return undefined
  }
  get user () {
    return this._user
  }
  get games () {
    return this._games
  }
  get cells () {
    return this._cells
  }
  get grid () {
    let grid = {}
    for (let cell of this.cells) {
      grid[cell.y] ||= {}
      grid[cell.y][cell.x] = cell
    }
    return grid
  }
  get creatureGrid () {
    let grid = {}
    if (this.creatures)
      for (let cell of this.creatures) {
        grid[cell.y] ||= {}
        grid[cell.y][cell.x] = cell
      }
    return grid
  }
  get game () {
    return this._game
  }
  set game (game) {
    w.auth.storage.setItem('gameid', game.id)
    this._game = game
    this.refresh().then(x => {
      m.route.set('/game')
    })
  }
  get gameList () {
    return this._gameList
  }
  async refresh () {
    if (this._game) {
      w.obj.Game.objects.one({ id: this._game.id }).then(game => {
        this.d('refreshing', game, this._game)
        // this._game = game
        let cells = this.updateCells()
        let creatures = this.updateCreatures()
        return Promise.all([cells, creatures])
      })
    }
  }
  toString () {
    return 'Arena'
  }
}
