import w from 'walax'
import m from 'mithril'

export default class Side {
  view () {
    let el = []
    if (w.arena.game && w.arena.game.phase == 'joining') {
      
      el.push(m('.sideOne', 'phase 0'))
    }
    return m('.side', el)
  }
}
