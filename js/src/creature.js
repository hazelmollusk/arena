import w from 'walax'
import m from 'mithril'

export default class Creature extends w.cls.Entity {
  view (vnode) {
    let creature = vnode.attrs.creature
    this.d('creature', creature)
    let img = m('img', { src: '/static/arena/images/tile/tree.png' })

    return m(
      'a.creature',
      {
        onclick: () => {}
      },
      img
    )
  }
}
