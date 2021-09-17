import m from 'mithril'
import w from 'walax'

export default class Board {
  view () {
    if (w.arena.game) {
      w.log.info('rendering board for game', w.arena.game)
      let grid = {}
      for (let cell of w.arena.cells) {
        grid[cell.y] ||= {}
        grid[cell.y][cell.x] = cell
      }
      let rows = [],
        cols = [],
        table = null
      try {
        for (let y = 1; y <= w.arena.game.size; y++) {
          cols = []
          for (let x = 1; x <= w.arena.game.size; x++) {
            let tileCls = ['tile']
            tileCls.push(grid[y][x].tile.toLowerCase())
            cols.push(m('td.' + tileCls.join('-')))
            console.log(x, y, grid[y][x].tile)
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
