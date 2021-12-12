import m from 'mithril'
import w from 'walax'
import GameList from './gamelist'

export default class Home extends w.cls.Entity {
  oninit () {
    Promise.all([w.arena.getCurrentUser(), w.arena.updateGameList()])
  }
  toString () {
    return 'Home'
  }
  view () {
    return m('.home', [
      m('input#gameName'),
      m(
        'select#gameSize',
        [5, 10, 15, 20, 30, 40].map(x => {
          return m('option', { value: x }, x)
        })
      ),
      m('input#gameSubmit', {
        type: 'button',
        value: 'Create game',
        onclick: () => {
          w.arena.getCurrentUser().then(x => {
            let name = document.getElementById('gameName').value
            let user = w.arena.user
            let size = document.getElementById('gameSize').value
            let game = new w.obj.Game({ name, owner: user.id, size })
            this.d('saving new game', game)
            game
              .save()
              .then(x => {
                //w.arena._game = game
                //m.route.set('/game')
                w.arena.updateGameList()
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
