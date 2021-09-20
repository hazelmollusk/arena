import m from 'mithril'
import w from 'walax'
import Creature from './creature'

export default class Board extends w.cls.Entity {
  view (vnode) {
    if (w.arena.game) {
      let grid = w.arena.grid
      let creatures = w.arena.creatureGrid
      this.d('board', w.arena.game, { grid, creatures })
      let rows = [],
        cols = [],
        table = null
      try {
        for (let y = 1; y <= w.arena.game.size; y++) {
          cols = []
          for (let x = 1; x <= w.arena.game.size; x++) {
            let tileCls = ['tile']
            let tileContent = `${x}/${y}`
            if (creatures[y] && creatures[y][x]) {
              this.d('creature found', creatures[y][x])
            }
            let tileId = ['tile', `${x}`, `${y}`].join('-')
            tileCls.push(grid[y][x].tile.toLowerCase())
            cols.push(
              m('td#' + tileId + '.' + tileCls.join('-'), {}, tileContent)
            )
          }
          rows.push(m('tr', cols))
        }
        table = m('table.board', rows)
      } catch (err) {
        this.e('loading cells', err)
      }
      return m('.boardPage', [m('h1', 'got cells'), table])
    } else {
      return m('h1', 'no game selected')
    }
  }
}
