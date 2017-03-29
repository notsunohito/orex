import _deepMerge from 'deepmerge'
import {dig, isPrimitive, isInteger, push} from './utils'


export function update(state, paths, updater, options={arrayMerge:defaultArrayMerge}) {
    const value = typeof updater === 'function'
        ? updater(state)
        : updater
    const newProp = paths.reverse().reduce((memo, path)=> {
        const emptyObj = isInteger(path) ? [] : {}
        emptyObj[path] = memo
        return emptyObj
    }, value)
    return deepMerge(state, newProp, options)
}

export function set(state, paths, valueCreator) {
    const value = typeof valueCreator === 'function'
        ? valueCreator(state)
        : valueCreator
    const holedProp = update(state, paths, null)
    const newProp = paths.reduce((memo, path)=> {
        const emptyObj = isInteger(path) ? [] : {}
        emptyObj[path] = memo
        return emptyObj
    }, value)
    return deepMerge(holedProp, newProp)
}

export function merge(state, paths, valueCreator) {
    return update(state, paths, valueCreator)
}

export function add(state, paths, creator) {
    const value = typeof creator === 'function'
        ? creator(state)
        : creator
    return update(state, paths, (state)=> {
        const array = dig(state, paths)
        return push(array, value)
    })
}

export function reject(state, _paths, rejector=null) {
    let paths = _paths
    let predicate
    if(typeof rejector === 'function') {
        // rejectだけど実体はfilterなのでbooleanを反転
        predicate = (state)=> !rejector(state)
    } else if(rejector === null){
        // users.at(2).reject()のときに
        // <= ['users', 2]
        // => pathは['users']にして, predicateは2番目の要素をrejectさせる
        paths = _paths.slice(0, _paths.length -1)
        predicate = (ele, i)=> i !== _paths[paths.length]
    } else {
        predicate = (ele, i)=> i !== rejector
    }
    return update(state, paths, (state)=> {
        const array = dig(state, paths)
        return array.filter(predicate)
    }, {arrayMerge:replaceArrayMerge})
}

export function deepMerge(a, b, options={arrayMerge:defaultArrayMerge}) {
    return _deepMerge(a, b, options)
}

const defaultArrayMerge = (_a, _b)=> {
    const length = Math.max(_a.length, _b.length)
    const a = []
    const b = []
    // lengthを揃える
    // <= [1,2,3], ['a','b','c','d','e']
    // => [1,2,3,,], ['a','b','c','d','e']
    for(let i=0; i<length; i++) {
        a[i] = _a[i]
        b[i] = _b[i]
    }

    // aとbをmerge
    let result = []
    for(let i=0; i<length; i++) {
        // bに値があればbの値で上書き
        if(typeof b[i] !== 'undefined') {
            // primitiveならそのまま使う
            if(isPrimitive(b[i])) {
                result.push(b[i])
                continue
            }
            // Objectなら再帰的にmergeしたものを使う
            result.push(_deepMerge(a[i], b[i], {arrayMerge:defaultArrayMerge}))
            continue
        }
        result.push(a[i])
    }
    return result
}

const replaceArrayMerge = (a, b)=> b
