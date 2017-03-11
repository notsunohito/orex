import {expect} from 'chai'
import {Store} from '../../src/createStore'
import ActionProxy from '../../src/actionProxy'


describe('actionProxy', ()=> {
    describe('class ActionProxy', ()=> {
        it('user.name.update(value)のようにしてstoreのstateを更新できる', ()=> {
            const state = {
                user: {
                    name: 'John',
                    age: 24
                }
            }
            const store = new Store(state)
            const actionProxy = new ActionProxy(store)
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

        it('users.at(0).name.update(value)のようにしてstoreの配列の要素のstateを更新できる', ()=> {
            const state = {
                users: [
                    {name: 'John', age: 19},
                    {name: 'Tom', age: 36},
                    {name: 'Ben', age: 24},
                ]
            }
            const store = new Store(state)
            const actionProxy = new ActionProxy(store)
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
            const actionProxy = new ActionProxy(store)
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
            const actionProxy = new ActionProxy(store)
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

        it('users.remove(1)のようにして要素を削除できる', ()=> {
            const state = {
                users: [
                    {name: 'John', age: 19},
                    {name: 'Tom', age: 36},
                    {name: 'Ben', age: 24},
                ]
            }
            const store = new Store(state)
            const actionProxy = new ActionProxy(store)
            actionProxy.users.remove(1)
            const nextState = {
                users: [
                    {name: 'John', age: 19},
                    {name: 'Ben', age: 24}
                ]
            }
            expect(store.getState()).eql(nextState)
        })

        it('users.at(1).remove()のようにして要素を削除できる', ()=> {
            const state = {
                users: [
                    {name: 'John', age: 19},
                    {name: 'Tom', age: 36},
                    {name: 'Ben', age: 24},
                ]
            }
            const store = new Store(state)
            const actionProxy = new ActionProxy(store)
            actionProxy.users.at(1).remove()
            const nextState = {
                users: [
                    {name: 'John', age: 19},
                    {name: 'Ben', age: 24}
                ]
            }
            expect(store.getState()).eql(nextState)
        })
    })
})
