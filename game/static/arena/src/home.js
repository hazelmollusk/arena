import m from 'mithril'

const GameList = {
    games: [],
    refresh() {
        w.log.info('home', 'refreshing')
        w.obj.Game.objects.all().then(x => {
            this.games = []
            x.forEach(g => {
                this.games.push(g)
            })
            m.redraw()
        })
    },
    view() {
        return m('ul.gameList', {}, GameList.games.map(g => {
            return m('li', g.name)
        }))
    }

}


export default class Home {
    selectGame(gameId) {

    }
    view() {
        return m('.home', [
            m('input#gameName'),
            m('input#gameSubmit', {
                type: 'button',
                value: 'Create game',
                onclick: () => {
                    let name = document.getElementById('gameName').value
                    w.arena.getCurrentUser().then(user => {
                        w.log.info('USER', user)
                        let game = new w.obj.Game({ name, owner: user.id })
                        game.save()
                        m.route.set('/game')
                    })
                }
            }),
            m('input#gameRefresh', {
                type: 'button',
                value: 'Refresh',
                onclick: () => {
                    console.log('refresh')
                    GameList.refresh()
                }
            }),
            m(GameList)
        ])
    }
}