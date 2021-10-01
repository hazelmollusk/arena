import m from 'mithril'
import Board from './board'

export default class Game {
  oninit () {}
  view () {
    Promise.resolve(w.obj.CreatureBase.objects.all())
    w.log.info('game', w.arena.game)
    const cn = w.arena?.game?.name || 'not selected'
    return (
      <div>
        <h1>Game: {cn}</h1>
        <Board />
      </div>
    )
  }
}
