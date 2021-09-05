import m from 'mithril'

export const GameList = {
    games: [],
    user: false,
    oninit: function () {
        w.log.info('gamelist init')
        w.arena.getCurrentUser().then(u => {
            w.log.info('gamelist user', u)
            GameList.user = u
        })
    },
    refresh: function () {
        w.log.info('home', 'refreshing')
        w.obj.Game.objects.all().then(x => {
            this.games = []
            x.forEach(g => {
                this.games.push(g)
            })
            m.redraw()
        })
    },
    selectGame(game) {
        this.game = game
        console.log('selectGame', game)
        m.route.set('/game')
        w.arena.game = game
        m.redraw()
    },
    view: function () {
        return m('ul.gameList', {}, GameList.games.map(g => {
            return m('li', m('a', {
                href: '#',
                onclick: () => {
                    GameList.selectGame(g)
                }
            }, g.name))
        }))
    }
}


export default class Home {

    view() {
        return m('.home', [
            m('input#gameName'),
            m('input#gameSize', { value: 40 }),
            m('input#gameSubmit', {
                type: 'button',
                value: 'Create game',
                onclick: () => {
                    let name = document.getElementById('gameName').value
                    let user = GameList.user
                    let size = document.getElementById('gameSize').value
                    let game = new w.obj.Game({ name, owner: user.id, size })
                    game.save()
                    GameList.selectGame(game)
                    m.route.set('/game')
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