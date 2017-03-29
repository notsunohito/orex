import Proxy from 'es2015-proxy'
import deepMerge from 'deepmerge'
import {dig, push, isInteger} from './utils'
import {
    update,
    replace,
    add,
    reject
} from './updater'


export default function createActionProxy(store) {
    // TODO: Refactor
    const customUpdaters = {}
    function createProxy(paths=[]) {
        const currProp = dig(store.getState(), paths)
        const proxyObj = createProxyObj(currProp)
        return new Proxy(proxyObj, {
            get: (target, property)=> {
                const customUpdaterPropName = createCustomUpdaterPropName(paths, property)
                if(typeof customUpdaters[customUpdaterPropName] !== 'undefined') return customUpdaters[customUpdaterPropName]
                if(shouldReturnUpdater('update', property, currProp)) return (modifier)=> updateStore(store, paths, update, modifier)
                if(shouldReturnUpdater('replace', property, currProp)) return (modifier)=> updateStore(store, paths, replace, modifier)
                if(shouldReturnUpdater('add', property, currProp)) return (modifier)=> updateStore(store, paths, add, modifier)
                if(shouldReturnUpdater('reject', property, currProp)) return (modifier)=> updateStore(store, paths, reject, modifier)
                if(shouldReturnUpdater('at', property, currProp)) return (index)=> at(paths, index)
                if(shouldReturnUpdater('def', property, currProp)) return (updaterName, customUpdater)=> def(paths, updaterName, customUpdater)
                const nextPaths = push(paths, property)
                return createProxy(nextPaths)
            }
        })
    }

    function at(paths, index){
        const nextPaths = push(paths, index)
        return createProxy(nextPaths)
    }

    // TODO: 実装:配列の要素のprop pathを指定したdefine
    function def(paths, updaterName, customUpdater) {
        updaterObj[updaterName] = null
        const propName = createCustomUpdaterPropName(paths, updaterName)
        customUpdaters[propName] = ()=> {
            const currAction = createProxy(paths)
            const currProp = dig(store.getState(), paths)
            const entireAction  = createProxy()
            const entireState = store.getState()
            customUpdater(currAction, currProp, entireAction, entireState)
            return createProxy()
        }
        return createProxy()
    }

    function createCustomUpdaterPropName(paths, updaterName) {
        return push(paths.filter((path)=>!isInteger(path)), updaterName).join('@')
    }

    function updateStore(store, paths, updater, modifier) {
        const nextState = updater(store.getState(), paths, modifier)
        store.setState(nextState)
        return createProxy()
    }

    function shouldReturnUpdater(updaterName, property, currProp) {
        // Force returns true if updaterName is prefixed with $ like $update.
        // $ prefixed updater is workaround for conflict between updaterName and state property name.
        if(property === `$${updaterName}`) return true
        return typeof currProp[updaterName] === 'undefined' && property === updaterName
    }

    // In proxy-polyfill, The properties you want to proxy must be known at creation time.
    // So create proxy object with updaterObj and currProp.
    // See also https://github.com/GoogleChrome/proxy-polyfill
    function createProxyObj(currProp) {
        return deepMerge(updaterObj, currProp)
    }

    const updaterObj =  {
        update: null,
        $update: null,
        replace: null,
        $replace: null,
        add: null,
        $add: null,
        reject: null,
        $reject: null,
        at: null,
        $at: null
    }

    return createProxy()
}
