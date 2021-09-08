import m from 'mithril'
import w from 'walax'

export default class Board {
  view () {
    if (w.arena.game) {
      w.log.info('cells', w.arena.game)
      let grid = {}
      for (let cell of w.arena.cells) {
        let x = cell.x
        let y = cell.y
        grid[y] ||= {}
        grid[y][x] = cell
        console.debug('cell', x, y, cell)
      }
      console.debug('grid', grid)
      let rows = [],
        cols = [],
        table = null
      try {
        for (let y = 1; y <= w.arena.game.size; y++) {
          cols = []
          for (let x = 1; x <= w.arena.game.size; x++) {
            cols.push(m('td', ['cell', x, y].join(', ')))
            console.log(x, y, grid[x] ? grid[x][y] : undefined)
          }
          rows.push(m('tr', cols))
        }
        table = m('table.board', rows)
      } catch (err) {
        w.log.error('loading cells', err)
      }
      return m('.boardPage', [m('h1', 'got cells'), table])
    } else {
      return m('h1', 'no game selected')
    }
  }
}
