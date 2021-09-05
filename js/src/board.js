import m from 'mithril'
import w from 'walax'

export default class Board {
  view () {
    if (w.arena.game) {
      w.log.info('cells', w.arena.game)
      let cells = w.obj.Cell.objects.filter({ game: w.arena.game.id })
      let grid = {}
      for (let cell in cells) {
        let x = cell.x
        let y = cell.y
        grid[x] ||= {}
        grid[x][y] = cell
        console.debug(x, y)
      }
      console.debug(grid)
      return m('h1', 'got cells')
    }
    return m('h1', 'new board')
  }
}
