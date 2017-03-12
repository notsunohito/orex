import React from 'react'
import {render} from 'react-dom'
import {createStore, Provider} from 'orex'


const initialState = { message: 'Greetings' }
const store = createStore(initialState)

const Greeting = ({state, action})=> (
    <div>
        <h1>{state.message}</h1>
        <button onClick={()=> action.message.update('Hello.')}>en</button>
        <button onClick={()=> action.message.update('你好。')}>zh</button>
        <button onClick={()=> action.message.update('こんにちは。')}>ja</button>
    </div>
)

render(
    <Provider store={store}>
        <Greeting />
    </Provider>,
    document.querySelector('#app')
)
