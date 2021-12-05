import w from 'walax'
import m from 'mithril'

export default class Spells extends w.cls.Entity {
  view () {
    let el = []
    if (w.arena.game.phase == 'play') {
      if (w.arena.selected) {
        let creature = w.arena.selected
        if (creature.user == w.arena.user.id) {
          let spells = w.arena._spells[creature.id]
          if (spells)
            for (let spell of spells) {
              let base = w.obj.SpellBase.objects.cached(spell.base)
              let classes = ['.spell']
              classes.push(base.alignment > 0 ? 'good' : 'evil')
              if (spell.used) classes.push('used')
              let cls = classes.join('.')
              el.push(
                m(
                  cls,
                  m(
                    'a' + cls,
                    {
                      onclick: x => {
                        w.arena.cast(spell)
                      }
                    },
                    base.name
                  )
                )
              )
            }
        }
      }
    }
    return m('.spells', el)
  }
}
