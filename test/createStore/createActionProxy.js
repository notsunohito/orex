import {expect} from 'chai'
import {Store} from '../../src/createStore'
import createActionProxy from '../../src/createStore/createActionProxy'


describe('actionProxy', ()=> {
    describe('function createActionProxy', ()=> {

        describe('Updater API', ()=> {
            it('user.name.update(value)のようにしてstoreのstateを更新できる', ()=> {
                const state = {
                    user: {
                        name: 'John',
                        age: 24
                    }
                }
                const store = new Store(state)
                const actionProxy = createActionProxy(store)
                actionProxy.user.name.update('Tom')
                let nextState = {
                    user: {
                        name: 'Tom',
                        age: 24
                    }
                }
                expect(store.getState()).to.eql(nextState)
                actionProxy.user.name.update('Ben')
                nextState = {
                    user: {
                        name: 'Ben',
                        age: 24
                    }
                }
                expect(store.getState()).to.eql(nextState)
            })

            it('stateのpropertyとactionの名前がconflictしているときはuser.update.$update(value)のようにしてstoreのstateを更新できる', ()=> {
                const state = {
                    user: {
                        update: 'John',
                        age: 24
                    }
                }
                const store = new Store(state)
                const actionProxy = createActionProxy(store)
                actionProxy.user.update.$update('Tom')
                let nextState = {
                    user: {
                        update: 'Tom',
                        age: 24
                    }
                }
                expect(store.getState()).to.eql(nextState)
            })
        })

        describe('Collection API', ()=> {
            it('users.at(0).name.update(value)のようにしてstoreの配列の要素のstateを更新できる', ()=> {
                const state = {
                    users: [
                        {name: 'John', age: 19},
                        {name: 'Tom', age: 36},
                        {name: 'Ben', age: 24},
                    ]
                }
                const store = new Store(state)
                const actionProxy = createActionProxy(store)
                // users[0]のnameを更新
                actionProxy.users.at(0).name.update('Notsu')
                let nextState = {
                    users: [
                        {name: 'Notsu', age: 19},
                        {name: 'Tom', age: 36},
                        {name: 'Ben', age: 24},
                    ]
                }
                // users[0]のageを更新
                expect(store.getState()).to.eql(nextState)
                // users[0]のageを更新
                actionProxy.users.at(0).age.update(29)
                nextState = {
                    users: [
                        {name: 'Notsu', age: 29},
                        {name: 'Tom', age: 36},
                        {name: 'Ben', age: 24},
                    ]
                }
                expect(store.getState()).eql(nextState)
            })

            it('users.at(0).replace({name: "Notsu"})のようにしてstateの配列の要素を置換できる', ()=> {
                const state = {
                    users: [
                        {name: 'John', age: 19},
                        {name: 'Tom', age: 36},
                        {name: 'Ben', age: 24},
                    ]
                }
                const store = new Store(state)
                const actionProxy = createActionProxy(store)
                actionProxy.users.at(0).replace({name: 'Notsu'})
                expect(store.getState()).to.eql({
                    users: [
                        {name: 'Notsu'},
                        {name: 'Tom', age: 36},
                        {name: 'Ben', age: 24},
                    ]
                })
            })

            it('users.add({name: "Notsu"})のようにして要素を追加できる', ()=> {
                const state = {
                    users: [
                        {name: 'John', age: 19},
                        {name: 'Tom', age: 36},
                        {name: 'Ben', age: 24},
                    ]
                }
                const store = new Store(state)
                const actionProxy = createActionProxy(store)
                actionProxy.users.add({name: 'Notsu', age: 29})
                const nextState = {
                    users: [
                        {name: 'John', age: 19},
                        {name: 'Tom', age: 36},
                        {name: 'Ben', age: 24},
                        {name: 'Notsu', age: 29},
                    ]
                }
                expect(store.getState()).eql(nextState)
            })

            it('users.reject(1)のようにして要素を削除できる', ()=> {
                const state = {
                    users: [
                        {name: 'John', age: 19},
                        {name: 'Tom', age: 36},
                        {name: 'Ben', age: 24},
                    ]
                }
                const store = new Store(state)
                const actionProxy = createActionProxy(store)
                actionProxy.users.reject(1)
                const nextState = {
                    users: [
                        {name: 'John', age: 19},
                        {name: 'Ben', age: 24}
                    ]
                }
                expect(store.getState()).eql(nextState)
            })

            it('users.at(1).reject()のようにして要素を削除できる', ()=> {
                const state = {
                    users: [
                        {name: 'John', age: 19},
                        {name: 'Tom', age: 36},
                        {name: 'Ben', age: 24},
                    ]
                }
                const store = new Store(state)
                const actionProxy = createActionProxy(store)
                actionProxy.users.at(1).reject()
                const nextState = {
                    users: [
                        {name: 'John', age: 19},
                        {name: 'Ben', age: 24}
                    ]
                }
                expect(store.getState()).eql(nextState)
            })
        })

        describe('Define API', ()=> {

            it('user.name.def("empty", Function)のようにして関数を定義できる', ()=> {
                const state = {
                    user: {
                        name: 'Notsu'
                    }
                }
                const store = new Store(state)
                const actionProxy = createActionProxy(store)
                actionProxy.user.name.def('empty', (name)=> name.update(''))
                actionProxy.user.name.empty()
                const nextState = {
                    user: {
                        name: ''
                    }
                }
                expect(store.getState()).eql(nextState)
            })
        })
    })
})
