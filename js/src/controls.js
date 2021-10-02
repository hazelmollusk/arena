import w from 'walax'
import m from 'mithril'

const joinButton = m(
  'button#join',
  {
    onclick: () => {
      alert('asdf')
      if (w.arena.game.phase == 0) {
        w.arena.getCurrentUser().then(x => {
          w.log.info('join', w.arena.user)
          if (w.arena.user) {
            w.arena.game.join()
          }
          return true
        })
        return true
      }
    }
  },
  'Join'
)

const startButton = m('input#start', {
  type: 'submit',
  value: 'Start',
  onclick: () => {
    w.log.info('start')
    return false
  }
})

export default class Controls extends w.cls.Entity {
  view () {
    let controls = []
    if (w.arena.game)
      switch (w.arena.game.phase) {
        case 'joining':
          this.d('joining controls')
          controls.push(joinButton)
          controls.push(startButton) //fixme only for owner
          break
        case 'play':
          break
        case 'ended':
          break
      }
    return m('#control', controls)
  }
}
