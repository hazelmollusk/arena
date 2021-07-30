import w from 'walax'
import m from 'mithril'
import {observable} from 'mobx'

let url = '/api/'
let prop = 'records'

var Stores = observable({
    list: [],
    addStore(name) {
        let s = new w.obj.Store()
        s.name = name
        s.save()
        Stores.loadList()
    },
    loadList: function () {
        return w.sleep(100).then(x=>{
            w.log.info('STORES','loadList()')
            Stores.list = []
            return w.obj.Store.objects.all().then(x => {
                x.forEach(z => { Stores.list.push(z) } )
                w.log.debug('Stores', Stores)
                m.redraw()
            })
        })
    },
    oninit: function() { Stores.loadList() },
    view: function (v) {
        w.log.info('STORES VIEW', Stores, Stores.list)
        return m('ul', Stores.list.map(s => {
            console.log(s)
            return m('li', [
                m('a',{ onclick:() => {
                    s.delete().then(x => { 
                        Stores.loadList() 
                    })
                }, href:'#'}, 'X'),
                m('.storeId', s.id),
                m(`input.storeName#storeName${s.id}`, {
                    value:s.name,
                    oninput: (x) => {
                        let sub = document.getElementById(`storeSubmit${s.id}`)
                        sub.hidden = false
                        let el = document.getElementById(`storeName${s.id}`)
                        el.value = x.target.value
                        s.name = el.value
                        return true
                    }
                }),
                m(`input.storeSubmit#storeSubmit${s.id}`, {
                    value:'Submit change',
                    hidden:true,
                    type:'submit',
                    onclick:() => {
                        s.save().then(x => {
                            Stores.loadList().then(xx => {
                                document.getElementById(`storeSubmit${s.id}`).hidden=true
                            });
                            
                        })
                        return false
                    }
                })
            ])
        }))
    },
    async start() {
        Stores.loadList()
        var e = document.getElementById('stores')
        m.mount(e, Stores)

    }
})
w.obj.load(prop, url).then(Stores.start)
window.Stores = Stores