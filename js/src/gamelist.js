import w from 'walax'
import m from 'mithril'

export default class GameList extends w.cls.Entity {
  view (vnode) {
    return m(
      'ul.gameList',
      {},
      w.arena.games.map(g => {
        return m(
          'li',
          m(
            'a',
            {
              href: '#',
              onclick: () => {
                w.arena.game = g
              }
            },
            g.name
          )
        )
      })
    )
  }
}
