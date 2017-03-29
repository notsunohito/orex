import React from 'react'
import {render} from 'react-dom'
import {createStore, Provider} from '../../../src/orex'


const initialState = { message: 'Hello World!' }
const store = createStore(initialState)

const HelloWorld = ({state, action})=> (
  <div>
    <input
      type="text"
      value={state.message}
      onChange={(e)=> action.message.set(e.target.value)}
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
