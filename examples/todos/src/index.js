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
      caption="Clear"
      onClick={()=>action.todos.set([])}
    />
    <ul id="todo-list">
      {state.todos.map((todo, i)=>(
        <Todo key={todo.key} todo={todo} todoAction={action.todos.at(i)} action={action} />
      ))}
    </ul>
  </div>
)

const Todo = ({todo, todoAction, action})=> {
    const style = todo.isDone ? {'textDecoration': 'line-through'} : {}
    return (
      <li>
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e)=>todoAction.isDone.set(e.target.checked)}
        />
        <span className="todo-name" style={style}>{todo.name}</span>
        <Icon type="remove" onClick={()=>action.todos.reject((_todo)=>_todo.key === todo.key)}/>
      </li>
    )
}

const Button = ({onClick, caption})=> (
  <button onClick={onClick}>
    {caption}
  </button>
)

const Icon = ({onClick, type})=> {
  const className = `glyphicon glyphicon-${type}`
  return (
    <span className={className} onClick={onClick}></span>
  )
}


render(
  <Provider store={store}>
    <Todos />
  </Provider>,
  document.querySelector('#app')
)
