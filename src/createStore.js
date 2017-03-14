/* @flow */
import createActionProxy from './createActionProxy'


export default function createStore(initialState:Object) {
    const store = new Store(initialState)

    function getState() {
        return store.getState()
    }

    function getAction() {
        return createActionProxy(store)
    }

    function subscribe(fn:Function) {
        store.subscribe(fn)
    }

    return {
        getState,
        getAction,
        subscribe
    }
}


export class Store {
    currentState:Object
    callbacks:Function[]
    
    constructor(initialState:Object) {
        this.currentState = initialState
        this.callbacks = []
    }
    getState() {
        return this.currentState
    }
    setState(nextState:Object) {
        this.currentState = nextState
        this.publish()
        return this
    }
    subscribe(fn:Function) {
        this.callbacks.push(fn)
    }
    publish() {
        this.callbacks.forEach((callback)=> callback(this.currentState))
    }
}
