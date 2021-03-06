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
    this._players = []
    this._spell = null
    this._targeting = false
    this._spellBases = null
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
    Promise.resolve(w.obj.CreatureBase.objects.all())
    Promise.resolve(w.obj.SpellBase.objects.all())
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
      this.d('current user retrieved')
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
    })
  }

  async updateSpells () {
    if (this.game) {
      w.obj.Spell.objects
        .filter({ creature__game_id: this.game.id })
        .then(s => {
          this._spells = {}
          s.forEach(spell => {
            if (!(spell.creature in this._spells))
              this._spells[spell.creature] = []
            this._spells[spell.creature].push(spell)
          })
        })
    }
    if (!this._spellBases) {
      this._spellBases = []
      w.obj.SpellBase.objects.all().then(spells => {
        spells.forEach(base => {
          this._spellBases[base.id] = base
        })
      })
    }
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

  async updatePlayers () {
    this._players = []
    if (this.game) {
      w.obj.GamePlayer.objects.filter({ game: this.game.id }).then(gp => {
        this.d('updatePlayers', gp)
        gp.forEach(gpx => {
          this.d('updatePlayers', gp, gpx)
          return w.obj.User.objects.filter({ id: gpx.user }).then(us => {
            us.forEach(u => {
              this._players.push(u)
            })
          })
        })
      })
    }
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
    this.d('SETTING GAME')
    this._game = game
    if (game) {
      w.auth.storage.setItem('gameid', game.id)
      this.refresh().then(x => {
        m.route.set('/game')
      })
    }
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

  get players () {
    return this._players
  }

  async refresh () {
    let promises = []
    promises.push(this.updateCreatures())
    promises.push(this.updateGameList())
    promises.push(this.getCurrentUser())

    if (this._game) {
      promises.push(w.obj.Game.objects.one({ id: this._game.id }))
      promises.push(this.updateCells())
      promises.push(this.updatePlayers())
      promises.push(this.updateSpells())
    }

    let x = Promise.all(promises).then(z => {
      m.redraw()
    })
    return x
  }
  clickTile (x, y) {
    if (this._targeting) {
      this._spell.cast({ x, y }).then(z => {
        if (z != 'fail') {
          this._targeting = false
          this._spell = null
          this.refresh()
        }
      })
    } else {
      return true
    }
    return false
  }
  click (creature) {
    // TODO handle target selection if needed
    if (this.selected == creature) {
      this.selected = null
    } else {
      this.selected = creature
    }
    this.refresh()
    w.log.info('click', creature)
  }
  toString () {
    return 'Arena'
  }
  getPropName () {
    return 'arena'
  }
  cast (spell) {
    let base = w.obj.SpellBase.objects.cached(spell.base)
    if (base.target_type == 'None') {
      spell.cast().then(x => {
        w.arena.refresh()
      })
    } else {
      this._targeting = true
      this._spell = spell
    }
  }
}
