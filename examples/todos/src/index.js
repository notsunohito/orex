import React from 'react'
import {render} from 'react-dom'
import uuid from 'uuid'
import {createStore, Provider} from '../../../src/orex'


const initialState = {
    inputTodoName: '',
    todos: []
}
const store = createStore(initialState)
const _action = store.getAction()

// Define custom updater
_action.def('addTodo', ([arg1], action)=>action.todos.add({key: uuid.v4(),name: arg1, isDone: false}))
_action.def('clearInputTodoName', (_, action)=>action.inputTodoName.set(''))


const Todos = ({state, action})=> (
  <div>
    <h1>Todo</h1>
    <input
      type="text"
      value={state.inputTodoName}
      onChange={(e)=>action.inputTodoName.set(e.target.value)}
    />
    <Button
      caption="Add"
      onClick={()=>{
        if(state.inputTodoName) action.addTodo(state.inputTodoName).clearInputTodoName()
      }}
    />
    <Button
      caption="clear"
      onClick={()=>action.todos.set([])}
    />
    <ul>
      {state.todos.map((todo, i)=>(
        <Todo key={todo.key} todo={todo} todoAction={action.todos.at(i)} />
      ))}
    </ul>
  </div>
)

const Todo = ({todo, todoAction})=> {
    const style = todo.isDone ? {'textDecoration': 'line-through'} : {}
    return (
      <li>
        <div>
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={(e)=>todoAction.isDone.set(e.target.checked)}
          />
          <label style={style}>{todo.name}</label>
        </div>
      </li>
    )
}

const Button = ({onClick, caption})=> (
    <button onClick={onClick}>
        {caption}
    </button>
)


render(
  <Provider store={store}>
    <Todos />
  </Provider>,
  document.querySelector('#app')
)
