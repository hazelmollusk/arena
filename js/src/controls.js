import w from 'walax'
import m from 'mithril'

const joinButton = () =>
  m(
    'button#join',
    {
      onclick: () => {
        if (w.arena.game.phase == 'joining') {
          w.arena.getCurrentUser().then(x => {
            w.log.info('join', w.arena.user)
            if (w.arena.user) {
              w.arena.game.join().then(x => {
                w.arena.refresh().then(xx => {
                  m.redraw()
                })
              })
            }
            return true
          })
          return true
        }
      }
    },
    'Join'
  )

const startButton = () =>
  m('input#start', {
    type: 'submit',
    value: 'Start',
    onclick: () => {
      w.log.info('start')
      w.arena.game.start().then(x => {
        w.arena.refresh()
      })
      return true
    }
  })

const endButton = () =>
  //todo hcheck player
  m('input#end', {
    type: 'submit',
    value: 'End Turn',
    onclick: () => {
      w.arena.game.endturn().then(x => {
        w.log.debug('ending turn', x)
        w.arena.refresh()
      })
      return true
    }
  })

const refreshButton = () =>
  m('input#refresh', {
    type: 'submit',
    value: 'Refresh',
    onclick: () => {
      w.arena.refresh().then(x => {
        m.redraw()
      })
    }
  })

export default class Controls extends w.cls.Entity {
  view () {
    let controls = []
    controls.push(refreshButton())
    if (w.arena.game)
      switch (w.arena.game.phase) {
        case 'joining':
          this.d('joining controls')
          controls.push(joinButton())
          if (w.arena.game.owner == w.arena.user.id) {
            controls.push(startButton())
          }
          break
        case 'play':
          if (w.arena.game.current == w.arena.user.id) {
            controls.push(endButton())
          }
          break
        case 'ended':
          break
      }
    return m('#control', controls)
  }
}
