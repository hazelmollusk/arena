import w from 'walax'
import m from 'mithril'

export default class Creature extends w.cls.Entity {
  view (vnode) {
    let creature = vnode.attrs.creature
    this.d('creature', creature)
    let icon = 'tree'
    let base = w.obj.CreatureBase.objects.cached(creature.base)
    if (base) icon = base.icon

    this.d('icon', icon, base)
    let img = m('img', {
      src: `/static/arena/images/tile/${icon}.png`
    })
    let sel = w.arena.selected == creature ? '.selected' : ''
    let zidx = 40
    if (icon == 'tree') zidx = 30
    return m(
      '.creature',
      { 'z-index': zidx },
      m(
        'a.creature' + sel,
        {
          onclick: () => {
            w.arena.click(creature)
          }
        },
        img
      )
    )
  }
}
