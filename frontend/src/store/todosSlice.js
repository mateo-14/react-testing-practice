import { fetchTodos } from '@/services/todosService'

export const createTodosSlice = (set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  removeTodo: (id) =>
    set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) })),
  completeTodo: (id) => set((state) => ({
    todos: state.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed }
      }
      return todo
    })
  })),
  fetchTodos: async () => {
    const todos = await fetchTodos()
    if (todos.status === 200) {
      set({ todos: todos.data })
    }
  }
})