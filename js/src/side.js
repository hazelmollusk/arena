import w from 'walax'
import m from 'mithril'

export default class Side extends w.cls.Entity {
  view () {
    let el = []
    if (w.arena.game && w.arena.game.phase == 'joining') {
      this.d('current players', w.arena.players)
      el.push(
        m(
          '.sideOne',
          w.arena.players.map(u => m('.player', u.username))
        )
      )
    }
    return m('.side', el)
  }
}
