/* eslint-disable react/prop-types */

import { useRef, useState } from "react"

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const inputRef = useRef(null)

  const handleAddTodo = () => {
    setTodos([{
        id: Date.now(),
        text: inputRef.current.value,
        completed: false
      },
      ...todos
    ])

    inputRef.current.value = ''
  }

  const handleTodoComplete = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed
        }
      }

      return todo
    }))
  }

  return (
    <div>
      <h1 className="text-xl">Todo List</h1>
      <div className="mt-2">
        <input type="text" placeholder="Add a new todo" className="px-2 py-1 rounded bg-neutral-800" defaultValue="" ref={inputRef}/>
        <button className="bg-purple-600 px-6 py-1 rounded ml-4" onClick={handleAddTodo}>Add</button>
      </div>
      <ul className="mt-5">
        {todos.map(todo => (
          <TodoItem key={todo.id} onComplete={handleTodoComplete} todo={todo} />
        ))}
      </ul>
    </div>
  )
}

const TodoItem = ({ todo, onComplete }) => {
  return (
    <li className={`flex items-center justify-between mt-2 bg-neutral-700 rounded px-4 py-1 hover:opacity-70 cursor-pointer transition ${todo.completed ? 'line-through opacity-70' : ''}`} onClick={() => onComplete(todo.id)}>
      {todo.text}
    </li>
  )
}

export default TodoList