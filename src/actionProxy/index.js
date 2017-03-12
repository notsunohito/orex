import Proxy from 'es2015-proxy'
import {
    update,
    replace,
    add,
    remove
} from './updater'


export default class ActionProxy {
    constructor(store) {
        this.store = store
        this.propPaths = []
        return this.createProxy()
    }
    createProxy() {
        return new Proxy(this, {
            get: (self, methodName)=> {
                if(methodName === 'update') return (updater)=> this.update(updater)
                if(methodName === 'replace') return (replacer)=> this.replace(replacer)
                if(methodName === 'add') return (creator)=> this.add(creator)
                if(methodName === 'remove') return (remover)=> this.remove(remover)
                if(methodName === 'at') return (index)=> this.at(index)
                this.propPaths.push(methodName)
                return this.createProxy()
            }
        })
    }
    update(updater) {
        const nextState = update(this.store.getState(), this.propPaths, updater)
        this.store.setState(nextState)
        this.propPaths = []
    }
    replace(replacer) {
        const nextState = replace(this.store.getState(), this.propPaths, replacer)
        this.store.setState(nextState)
        this.propPaths = []
    }
    add(creator) {
        const nextState = add(this.store.getState(), this.propPaths, creator)
        this.store.setState(nextState)
        this.propPaths = []
    }
    remove(remover) {
        const nextState = remove(this.store.getState(), this.propPaths, remover)
        this.store.setState(nextState)
        this.propPaths = []
    }
    at(index) {
        this.propPaths.push(index)
        return this.createProxy()
    }
}
