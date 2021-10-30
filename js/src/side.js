import w from 'walax'
import m from 'mithril'

export default class Side extends w.cls.Entity {
  view () {
    let el = []
    if (w.arena.game)
      if (w.arena.game.phase == 'joining') {
        this.d('current players', w.arena.players)
        el.push(
          m(
            '.sideOne',
            w.arena.players.map(u => m('.player', u.username))
          )
        )
      } else if (w.arena.game.phase == 'play') {
        if (w.arena.selected) {
          let creature = w.arena.selected
          let base = w.obj.CreatureBase.objects.cached(creature.base)
          el.push(m('.creatureName', base.name))
          el.push(m('.creatureHp', ['HP: ', creature.hp, '/', base.hp]))
          el.push(
            m('.creatureMoves', ['Moves: ', creature.moves, '/', base.moves])
          )
          this.d('creature actions', { creature, user: w.arena.user })
          if (creature.user == w.arena.user.id && creature.moves > 0) {
            el.push(m('hr.creatureActions'))
            let moveRows = []
            let moveLabels = ['UL', 'U', 'UR', 'L', '', 'R', 'DL', 'D', 'DR']
            for (let y of [-1, 0, 1]) {
              let moveCols = []
              for (let x of [-1, 0, 1]) {
                let label = moveLabels.shift()
                if (label != '') {
                  moveCols.push(
                    m(
                      'td.moveDirection',
                      m(
                        'a',
                        {
                          onclick: () => {
                            w.log.info('moving', creature, x, y)
                            return creature.move({ x: x, y: y }).then(x => {
                              w.arena.refresh()
                            })
                          }
                        },
                        m('img', {
                          src: 'images/ico/' + label + '.png'
                        })
                      )
                    )
                  )
                } else {
                  moveCols.push(m('td'))
                }
              }
              moveRows.push(m('tr', moveCols))
            }
            let moveTable = m('table.moveTable', moveRows)
            el.push(moveTable)
          }
        }
      }
    return m('.side', el)
  }
}
