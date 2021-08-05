import m from 'mithril'

export default class Login {
    view() {
        return !w.auth.state ?
            m('.login', [
                m('input#alias'),
                m('input#password', { 'type': 'password' }),
                m('input#submitLogin', {
                    'type': 'button',
                    'value': 'Log in',
                    'onclick': () => {
                        let username = document.getElementById('alias').value
                        let password = document.getElementById('password').value
                        w.auth.authenticate(username, password).then(x => {
                            m.redraw()
                        })
                    }
                })
            ]) :
            m('.login', [
                m('.accessToken', w.auth.token),
                m('input#logout', {
                    'type': 'button',
                    'value': 'Log out',
                    'onclick': () => {
                        w.log.info('logging out')
                        w.auth.logout().then(x => { m.redraw() })
                    }
                })
            ])
    }
}