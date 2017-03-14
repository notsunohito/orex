import Proxy from 'es2015-proxy'
import {
    update,
    replace,
    add,
    reject
} from './updater'

export default function createActionProxy(store) {
    function createProxy(paths=[]) {
        return new Proxy({}, {
            get: (target, property)=> {
                if(property === 'update') return (modifier)=> updateStore(store, paths, update, modifier)
                if(property === 'replace') return (modifier)=> updateStore(store, paths, replace, modifier)
                if(property === 'add') return (modifier)=> updateStore(store, paths, add, modifier)
                if(property === 'reject') return (modifier)=> updateStore(store, paths, reject, modifier)
                if(property === 'at') return (index)=> at(paths, index)
                // immutably push
                const nextPaths = [].concat(paths, property)
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
        paths.push(index)
        return createProxy(paths)
    }

    return createProxy()
}
