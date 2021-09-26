import m from 'mithril'
import w from 'walax'
import GameList from './gamelist'

export default class Home {
  oninit () {
    Promise.all([w.arena.updateUser(), w.arena.updateGameList()])
  }
  view () {
    return m('.home', [
      m('input#gameName'),
      m('input#gameSize', { value: 40 }),
      m('input#gameSubmit', {
        type: 'button',
        value: 'Create game',
        onclick: () => {
          w.arena.getCurrentUser().then(x => {
            let name = document.getElementById('gameName').value
            let user = w.arena.user
            let size = document.getElementById('gameSize').value
            let game = new w.obj.Game({ name, owner: user.id, size })
            w.log.info('saving new game', game)
            game
              .save()
              .then(x => {
                w.arena.game = game
                m.route.set('/game')
              })
              .catch(err => {
                w.log.error('ERROR SAVING', { game, err })
              })
          })
        }
      }),
      m('input#gameRefresh', {
        type: 'button',
        value: 'Refresh',
        onclick: () => {
          console.log('refresh')
          w.arena.updateGameList()
        }
      }),
      m(GameList)
    ])
  }
}
