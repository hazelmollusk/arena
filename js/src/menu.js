import m from 'mithril'
const l = (t, u, o) => m(m.route.Link, { href: u, options: o }, t)

export default class Game {
  view () {
    let login = 'Login'
    if (w.arena.user) {
      login = w.arena.user.username
    }
    return m('h1', [l('Home', '/home'), l('Game', '/game'), l(login, '/login')])
  }
}
