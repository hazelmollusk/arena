import w from 'walax'
import m from 'mithril'

export default class GameList extends w.cls.Entity {
  view (vnode) {
    return m(
      'table.gameList',
      {},
      w.arena.games.map(g => {
        return m(
          'tr',
          m(
            'td',
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
          ),
          m('td', g.size)
        )
      })
    )
  }
}
