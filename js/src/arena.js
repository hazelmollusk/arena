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
    this._selected = null
  }
  start () {
    document.body.innerHTML = '<div id="menu"></div> <div id="page"/>'
    m.mount(document.getElementById('menu'), Menu)
    m.route(document.getElementById('page'), '/home', {
      '/home': Home,
      '/game': Game,
      '/login': Login
    })
  }
  loadGame () {
    if (w.auth.storage.getItem('gameid', false)) {
      let gameId = w.auth.storage.getItem('gameid')
      w.sleep(1000).then(x => {
        w.obj.Game.objects.one({ id: gameId }).then(g => {
          //fixmea
          alert('asdf')
          this.game = g
        })
      })
    }
  }
  async getCurrentUser () {
    return w.net.get(`${w.apiBase}auth/user/`).then(user => {
      let obj = w.obj.receiveObject(w.obj.User, user)
      this._user = obj
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
  async updateGameList () {
    this.i('refreshing game list')
    return w.obj.Game.objects.all().then(x => {
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
  get selected () {
    return this._selected
  }
  set selected (val) {
    this._selected = val
    return val
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
  get creatures () {
    return this._creatures
  }
  set game (game) {
    w.auth.storage.setItem('gameid', game.id)
    this._game = game
    this.refresh().then(x => {
      m.route.set('/game')
    })
  }
  get gameId () {
    if (this.game) return this.game.id
    return ''
  }
  set gameId (gid) {
    w.obj.Game.objects.one((id = gid)).then(g => {
      this.game = g
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
