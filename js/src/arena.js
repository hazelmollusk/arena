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
    this.loadGame()
  }

  loadGame () {
    if (w.auth.storage.getItem('gameid', false)) {
      let gameId = w.auth.storage.getItem('gameid')
      return w.obj.Game.objects.one({ id: gameId }).then(g => {
        //fixmea
        this.game = g
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
      this._user = await this.getCurrentUser()
      return this._user
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
    if (game) this._game = game
    this.refresh().then(x => {
      this.d('setting game', game, x)
      m.route.set('/game')
    })
  }

  get gameId () {
    if (this.game) return this.game.id
    return undefined
  }

  set gameId (gid) {
    w.obj.Game.objects.one({ id: gid }).then(g => {
      this.game = g
    })
  }

  get gameList () {
    return this._gameList
  }

  async refresh () {
    let creatures = this.updateCreatures()
    let games = this.updateGameList()
    let cells = async x => true
    let gamef = async x => true
    let user = this.getCurrentUser()

    if (this._game) {
      let game = await w.obj.Game.objects.one({ id: this._game.id })
      this.d('refreshing game', game, this._game)
      this._game = game
      cells = this.updateCells()
    }

    return Promise.all([gamef, user, cells, creatures, games])
  }
  toString () {
    return 'Arena'
  }
  getPropName () {
    console.log('GETTING')
    return 'arena'
  }
}
