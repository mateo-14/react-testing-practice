import { useEffect, useRef } from "react"
import { useBoundStore } from "@/store/store"

const TodoList = () => {
  const todos = useBoundStore(state => state.todos)
  const addTodo = useBoundStore(state => state.addTodo)
  const toggleCompleteTodo = useBoundStore(state => state.toggleCompleteTodo)
  const fetchTodos = useBoundStore(state => state.fetchTodos)
  const deleteTodo = useBoundStore(state => state.deleteTodo)

  const inputRef = useRef(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleAddTodo = async () => {
    if (!inputRef.current.value) {
      return
    }

    addTodo(inputRef.current.value)
    inputRef.current.value = ''
  }


  const handleToggleCompleteTodo = (id) => {
    toggleCompleteTodo(id)
  }

  const handleDeleteTodo = (id) => {
    deleteTodo(id)
  }

  return (
    <div>
      <h1 className="text-xl">Todo List</h1>
      <div className="mt-2">
        <input type="text" placeholder="Add a new todo" className="px-2 py-1 rounded bg-neutral-800" defaultValue="" ref={inputRef} />
        <button className="bg-purple-600 px-6 py-1 rounded ml-4" onClick={handleAddTodo}>Add</button>
      </div>
      <ul className="mt-5" aria-label="Todo list">
        {todos.map(todo => (
          <TodoItem key={todo.tempId ?? todo.id} onComplete={handleToggleCompleteTodo} todo={todo} onDelete={handleDeleteTodo}/>
        ))}
      </ul>
    </div>
  )
}

const TodoItem = ({ todo, onComplete, onDelete }) => {
  return (
    <li className={`group flex items-center justify-between mt-2 bg-neutral-700 rounded pl-4 pr-2 py-1 hover:opacity-70 cursor-pointer transition ${todo.is_completed ? 'line-through opacity-70' : ''}`} onClick={() => onComplete(todo.id)}>
      {todo.title}
      <button aria-label="Delete todo" className="text-white opacity-60 hover:opacity-100 hover:scale-110 transition" onClick={() => onDelete(todo.id)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
      </button>
    </li>
  )
}

export default TodoList