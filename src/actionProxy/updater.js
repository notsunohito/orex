import deepMerge from 'deepmerge'


export function update(state, paths, updater, options={arrayMerge:defaultArrayMerge}) {
    const value = typeof updater === 'function'
        ? updater(state)
        : updater
    const newProp = paths.reverse().reduce((memo, path)=> {
        const isArray = Number.isInteger(path)
        const emptyObj = isArray ? [] : {}
        emptyObj[path] = memo
        return emptyObj
    }, value)
    return merge(state, newProp, options)
}

export function replace(state, paths, replacer) {
    const value = typeof replacer === 'function'
        ? replacer(state)
        : replacer
    const holedProp = update(state, paths, null)
    const newProp = paths.reduce((memo, path)=> {
        const isArray = Number.isInteger(path)
        const emptyObj = isArray ? [] : {}
        emptyObj[path] = memo
        return emptyObj
    }, value)
    return merge(holedProp, newProp)
}

export function add(state, paths, creator) {
    const value = typeof creator === 'function'
        ? creator(state)
        : creator
    return update(state, paths, (state)=> {
        const array = dig(state, paths)
        return [].concat(array, value)
    })
}

export function remove(state, _paths, remover=null) {
    let paths = _paths
    let predicate
    if(typeof remover === 'function') {
        predicate = remover
    } else if(remover === null){
        // users.at(2).remove()のときに
        // <= ['users', 2]
        // => pathは['users']にして, predicateは2番目の要素をremoveさせる
        paths = _paths.slice(0, _paths.length -1)
        predicate = (ele, i)=> i !== _paths[paths.length]
    } else {
        predicate = (ele, i)=> i !== remover
    }
    return update(state, paths, (state)=> {
        const array = dig(state, paths)
        return array.filter(predicate)
    }, {arrayMerge:replaceArrayMerge})
}

export function merge(a, b, options={arrayMerge:defaultArrayMerge}) {
    return deepMerge(a, b, options)
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
            // リテラルならそのまま使う
            if(typeof b[i] === 'string' || typeof b[i] === 'number' || b[i] === null) {
                result.push(b[i])
                continue
            }
            // Objectなら再帰的にmergeしたものを使う
            result.push(merge(a[i], b[i]))
            continue
        }
        result.push(a[i])
    }
    return result
}
const replaceArrayMerge = (a, b)=> b

function dig(obj, paths) {
    return paths.reduce((memo, path)=>memo[path], obj)
}