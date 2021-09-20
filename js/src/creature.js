import w from 'walax'

export default class Creature extends w.cls.Entity {
  view (vnode) {
    creature = vnode.attrs.creature
    this.d('creature', creature)
  }
}
