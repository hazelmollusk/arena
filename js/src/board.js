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
              if (creatures[y][x].alive) {
                this.d('creature found', creatures[y][x])
                tileContent = m(Creature, { creature: creatures[y][x] })
              }
            }
            let tileId = ['tile', `${x}`, `${y}`].join('-')
            tileCls.push(grid[y][x].tile.toLowerCase())
            cols.push(
              m(
                'td#' + tileId + '.' + tileCls.join('-'),
                {
                  onclick: z => w.arena.clickTile(x, y)
                },
                tileContent
              )
            )
          }
          rows.push(m('tr', cols))
        }
        table = m('table.board', rows)
      } catch (err) {
        this.e('loading cells', err)
      }

      let layout = [
        m(Controls),
        m('hr'),
        m(
          '.board.container-fluid',
          m('.row.row-fluid.boardRow', [
            m('.boardCol.boardTable.col.col-lg-auto', table),
            m('.boardCol.side.col.col-sm-auto', m(Side)),
            m('.boardCol.spells.col.col-sm-auto', m(Spells))
          ])
        )
      ]
      return m('.boardPage', layout)
    } else {
      return m('h1', 'no game selected')
    }
  }
}
