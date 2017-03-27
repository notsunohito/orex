export function dig(obj, paths) {
    if(paths.length < 1) return obj
    return paths.reduce((memo, path)=>memo[path], obj)
}

export function isPrimitive(value) {
    return value == null || (typeof value !== 'function' && typeof value !== 'object');
}

export function isInteger(value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
}

// immutable push
export function push(arr, element) {
    return [].concat(arr, element)
}
