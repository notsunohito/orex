import Proxy from 'es2015-proxy'
import {dig, isPrimitive, push} from './utils'
import {
    update,
    replace,
    add,
    reject
} from './updater'


export default function createActionProxy(store) {
    function createProxy(paths=[]) {
        const currProp = dig(store.getState(), paths)
        const proxyObj = isPrimitive(currProp) ? {update: null, replace: null, add: null, reject: null, at: null} : currProp
        return new Proxy(proxyObj, {
            get: (target, property)=> {
                if(property === 'update') return (modifier)=> updateStore(store, paths, update, modifier)
                if(property === 'replace') return (modifier)=> updateStore(store, paths, replace, modifier)
                if(property === 'add') return (modifier)=> updateStore(store, paths, add, modifier)
                if(property === 'reject') return (modifier)=> updateStore(store, paths, reject, modifier)
                if(property === 'at') return (index)=> at(paths, index)
                // immutably push
                const nextPaths = push(paths, property)
                return createProxy(nextPaths)
            }
        })
    }

    function updateStore(store, paths, updater, modifier) {
        const nextState = updater(store.getState(), paths, modifier)
        store.setState(nextState)
        return createProxy()
    }

    function at(paths, index){
        const nextPaths = push(paths, index)
        return createProxy(nextPaths)
    }

    return createProxy()
}
