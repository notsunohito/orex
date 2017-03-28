# Orex
Orex is a Configureless state container.

- Configureless.
- Easy to learn.
- Focus on synchronous complicated form UI, not for SPA.(as of now)

# Motivation
I think react must be written as SFC(Stateless functional components) in general.
But writing SFC enforces using some state container which annoying us to setup.

Yes, it mentions Redux. Redux is a great framework.
But it's too complex to write just a UI which is not a SPA, especially if it has many forms.
So I wrote orex to solve those issues.

If you see [Getting Started](https://github.com/notsunohito/orex/wiki#getting-started), you'll find that [greetings example](http://notsu.gg/orex/examples/greetings/) is written in about 20 lines.
If you just want to learn React or writing prototype apps,

[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367). You Might Need Orex.

# Installation
```
$ npm install --save orex
```

# Hello World
[live demo](http://notsu.gg/orex/examples/helloworld)

```js
import React from 'react'
import {render} from 'react-dom'
import {createStore, Provider} from 'orex'


const initialState = { message: 'Hello World!' }
const store = createStore(initialState)

const HelloWorld = ({state, action})=> (
    <div>
        <input
            type="text"
            value={state.message}
            onChange={(e)=> action.message.update(e.target.value)}
        />
        <p>{state.message}</p>
    </div>
)

render(
    <Provider store={store}>
        <HelloWorld />
    </Provider>,
    document.querySelector('#app')
)
```

# API
## Orex
- `createStore(initialState)`
	- returns `store:Store`
- `<Provider {store:Store, mapStoreToProps:(store)=>{state, action}}>`
	- provides props`{store, action}` for child react component.
	- supports mapStoreToProps
	    - default `(store)=>{state, action}`

## Store
- `getState()`
	- returns `currentState`
- `getAction()`
	- returns `action:ActionProxy`
- `subscribe(callback:(currentState)=>any)`

## ActionProxy
- Proxies modifying store's state.

### ActionProxy.{{key}}.{{key}}.update(value)
- Update `state[key][key]` to `value`

```js
import {createStore} from 'orex'
const initialState = {
  gretting: {
    message: 'Hi!'
  }
}
const store = createStore(initialState)

// action:ActionProxy
const action = store.getAction()

// updates greeting.message to 'Bye!'
action.greeting.message.update('Bye!')

store.getState()
// => { greeting: message: 'Bye!' }
```

### ActionProxy.at(index:number)
- Allows specifying index of collection.

```js
const initialState = {
  users: [
    {name: 'Pure'},
    {name: 'Daizu'},
    {name: 'Momo'}
  ]
}
const store = createStore(initialState)
const action = store.getAction()

// at(index) allows specifying index of collection.
action.users.at(2).name.update('Konoha')

store.getState()
/**
=> {
     users: [
       {name: 'Pure'},
       {name: 'Daizu'},
       {name: 'Konoha'}
     ]
   }
**/
```

### Available operation
- Modifying object
	- `update(value:any)`
	- `update(updater:(state)=>any)`
	- `replace(value:any)`
	- `replace(replacer:(state)=>any)`
- Modifying collection
	- `add(creater:any)`
	- `add(creater:(state)=>any)`
	- `reject(index:number)`
	- `reject(rejector:(state)=>boolean)`

# Examples
- [Hello World](https://github.com/notsunohito/orex/tree/master/examples/helloworld)
	- [live demo](http://notsu.gg/orex/examples/helloworld/)
- [Greetings](https://github.com/notsunohito/orex/tree/master/examples/greetings)
	- [live demo](http://notsu.gg/orex/examples/greetings/)

# License
MIT
