import m from 'mithril'
import w from 'walax'
import Creature from './creature'
import Controls from './controls'
import Side from './side'
import Spells from './spells'

export default class Board extends w.cls.Entity {
  toString () {
    return 'Board'
  }
  view (vnode) {
    if (w.arena.game) {
      let grid = w.arena.grid
      let creatures = w.arena.creatureGrid
      this.d(w.arena.game, { grid, creatures })
      let rows = [],
        cols = [],
        table = null
      try {
        for (let y = 1; y <= w.arena.game.size; y++) {
          cols = []
          for (let x = 1; x <= w.arena.game.size; x++) {
            let tileCls = ['tile']
            let tileContent = ' '
            if (creatures[y] && creatures[y][x]) {
              this.d('creature found', creatures[y][x])
              tileContent = m(Creature, { creature: creatures[y][x] })
            }
            let tileId = ['tile', `${x}`, `${y}`].join('-')
            tileCls.push(grid[y][x].tile.toLowerCase())
            cols.push(
              m('td#' + tileId + '.' + tileCls.join('-'), {}, tileContent)
            )
          }
          if (y == 1) {
            cols.push(
              m(
                'td#side',
                { rowspan: w.arena.game.size, valign: 'top' },
                m(Side)
              )
            )
            cols.push(
              m(
                'td#spells',
                { rowspan: w.arena.game.size, valign: 'top' },
                m(Spells)
              )
            )
          }
          rows.push(m('tr', cols))
        }
        table = m('table.board', rows)
      } catch (err) {
        this.e('loading cells', err)
      }
      return m('.boardPage', [m(Controls), m('hr'), table])
    } else {
      return m('h1', 'no game selected')
    }
  }
}
