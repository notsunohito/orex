import {expect} from 'chai'
import {update, set, add, reject, merge} from '../../src/createStore/updater'


describe('updater', ()=> {

    describe('function update', ()=> {

        it('存在するstateのpropertyのpathを指定して更新できる', ()=> {
            const state = {
                company: {
                    name: 'Socket',
                    zipCode: '107-0062'
                }
            }

            // company.nameが更新される
            expect(update(state, ['company', 'name'], 'Supership')).eql({
                company: {
                    name: 'Supership',
                    zipCode: '107-0062'
                }
            })
            // immutableに更新する
            expect(state).to.eql({
                company: {
                    name: 'Socket',
                    zipCode: '107-0062'
                }
            })
        })

        it('存在しないstateのpropertyのpathを指定するとpropertyが新たに追加される', ()=> {
            const state = {
                company: {
                    name: 'Socket',
                    zipCode: '107-0062'
                }
            }

            expect(update(state, ['company', 'address'], 'Minato-ku, Tokyo')).to.eql({
                company: {
                    name: 'Socket',
                    zipCode: '107-0062',
                    address: 'Minato-ku, Tokyo'
                }
            })
        })

        it('配列を更新できる', ()=> {
            const state = [1,2,3,4,5]
            expect(update(state, [1], 20)).to.eql([1,20,3,4,5])

        })

        it('多次元配列を更新できる', ()=> {
            const state = [
                [1,2,3,4,5],
                ['a','b','c']
            ]
            expect(update(state, [1, 1], 'B')).to.eql([
                [1,2,3,4,5],
                ['a','B','c']
            ])
        })

        it('updaterが関数のときはその関数にstateを適用した値で更新する', ()=> {
            const state = {
                name: 'Notsu',
                age: 24
            }
            const updater = (state)=> `Hi I'm ${state.name}, ${state.age} years old.`
            expect(update(state, ['greetings'], updater)).to.eql({
                name: 'Notsu',
                age: 24,
                greetings: "Hi I'm Notsu, 24 years old."
            })
        })
    })

    describe('function set', ()=> {

        it('存在するstateのpropertyのpathを指定して置換できる', ()=> {
            const state = {
                company: {
                    department: {
                        division: {
                            name: 'Notsu',
                            age: 24
                        }
                    }
                }
            }

            // company.department.divisionが更新される
            expect(set(state, ['company', 'department', 'division'], {test: 'Hello'})).eql({
                company: {
                    department: {
                        division: {
                            test: 'Hello'
                        }
                    }
                }
            })
            // immutableに更新する
            expect(state).to.eql({
                company: {
                    department: {
                        division: {
                            name: 'Notsu',
                            age: 24
                        }
                    }
                }
            })
        })

        it('存在するstateのpropertyのpathを指定して置換できる', ()=> {
            const state = {
                company: {
                    department: {
                        name: 'Konoha',
                        division: {
                            name: 'Notsu'
                        }
                    }
                }
            }

            const replacer = (state)=> {
                return {greetings: `Hi I'm ${state.company.department.division.name}!`}
            }
            // company.department.divisionが置換される
            expect(set(state, ['company', 'department', 'division'], replacer)).eql({
                company: {
                    department: {
                        name: 'Konoha',
                        division: {
                            greetings: "Hi I'm Notsu!"
                        }
                    }
                }
            })
        })

        it('配列の要素を置き換えられる', ()=> {
            const state = {
                users: [
                    {name: 'John', age: 19},
                    {name: 'Tom', age: 36},
                    {name: 'Ben', age: 24},
                ]
            }

            expect(set(state, ['users', 1, 'age'], {test:'Hello'})).to.eql({
                users: [
                    {name: 'John', age: 19},
                    {name: 'Tom', age: { test: 'Hello'} },
                    {name: 'Ben', age: 24},
                ]
            })
        })

        it('2次元配列の要素を置き換えらえる', ()=> {
            const state = {
                users: [
                    [1,2,3,4,5],
                    ['a','b','c']
                ]
            }

            expect(set(state, ['users', 1, 1], {test:'Hello'})).to.eql({
                users: [
                    [1,2,3,4,5],
                    ['a',{test:'Hello'},'c']
                ]
            })
        })
    })

    describe('function add', ()=> {

        it('stateの配列に対して要素を追加できる', ()=> {
            const state = {
                users: [
                    {name: 'Pure'},
                    {name: 'Konoha'}
                ]
            }
            expect(add(state, ['users'], {name: 'Notsu'})).to.eql({
                users: [
                    {name: 'Pure'},
                    {name: 'Konoha'},
                    {name: 'Notsu'}
                ]
            })
        })

        it('updaterが関数のときはその関数にstateを適用した値で更新する', ()=> {
            const state = {
                my: {name: 'Notsu'},
                users: [
                    {name: 'Pure'},
                    {name: 'Konoha'}
                ]
            }
            const updater = (state)=>{
                return {name: state.my.name}
            }
            expect(add(state, ['users'], updater)).to.eql({
                my: {name: 'Notsu'},
                users: [
                    {name: 'Pure'},
                    {name: 'Konoha'},
                    {name: 'Notsu'}
                ]
            })
        })
    })

    describe('function reject', ()=> {

        it('stateの配列の指定したindexを削除できる', ()=> {
            const state = {
                users: [
                    {name: 'Pure'},
                    {name: 'Konoha'},
                    {name: 'Notsu'}
                ]
            }
            expect(reject(state, ['users'], 1)).to.eql({
                users: [
                    {name: 'Pure'},
                    {name: 'Notsu'}
                ]
            })
        })

        it('rejectorが関数のときはその関数でrejectした配列で置き換える', ()=> {
            const state = {
                users: [
                    {name: 'Pure'},
                    {name: 'Konoha'},
                    {name: 'Notsu'}
                ]
            }
            const rejector = (array)=>{
                return array.name === 'Konoha'
            }
            expect(reject(state, ['users'], rejector)).to.eql({
                users: [
                    {name: 'Pure'},
                    {name: 'Notsu'}
                ]
            })
        })

        it('stateの配列の指定したindexを削除できる', ()=> {
            const state = {
                users: [
                    {name: 'Pure'},
                    {name: 'Konoha'},
                    {name: 'Notsu'}
                ]
            }
            expect(reject(state, ['users', 1])).to.eql({
                users: [
                    {name: 'Pure'},
                    {name: 'Notsu'}
                ]
            })
        })
    })

    describe('function merge', ()=> {

        it('immutableにmergeする', ()=> {
            const a = {
                name: 'Pure',
                age: 24
            }
            const b = {
                name: 'Konoha'
            }
            expect(merge(a, b)).to.eql({
                name: 'Konoha',
                age: 24
            })
            expect(a).to.eql({
                name: 'Pure',
                age: 24
            })
            expect(b).to.eql({
                name: 'Konoha'
            })
        })

        it('配列の要素がa, bともにstring|numberのときはbで上書きする', ()=> {
            const a = [1,2,3,4,undefined]
            const b = ['a',undefined,'c']
            const res = merge(a, b)
            expect(res).to.eql(['a', 2, 'c', 4, undefined])
            expect(res.length).to.equal(5)
        })

        it('配列の要素がaがobject, bがstring|numberのときはbで上書きする', ()=> {
            const a = [
                {name: 'Pure'},
                {name: 'Konoha'}
            ]
            const b = [
                undefined,
                1
            ]
            const res = merge(a, b)
            expect(res).to.eql([
                {name: 'Pure'},
                1
            ])
        })

        it('配列の要素がaがobject, bがobjectのときはmergeする', ()=> {
            const a = [
                {name: 'Pure'},
                {name: 'Konoha'}
            ]
            const b = [
                undefined,
                {name: 'Notsu', age: 24}
            ]
            const res = merge(a, b)
            expect(res).to.eql([
                {name: 'Pure'},
                {name: 'Notsu', age: 24}
            ])
        })

        it('配列同士のmergeではlengthが大きい方に小さい方をmergeする', ()=> {
            const a = [1,2,3]
            const b = [,,,4,5]
            expect(merge(a,b)).to.eql([1,2,3,4,5])
        })
    })
})
