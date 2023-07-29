import { fetchTodos, createTodo, completeTodo } from '@/services/todosService'
import { uncompleteTodo } from '../services/todosService'

export const createTodosSlice = (set, get) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  addTodo: async (title) => {
    const tempId = Math.random().toString(36).substring(2, 9)
    try {
      set((state) => ({
        todos: [...state.todos, {
          tempId,
          title,
          is_completed: false
        }]
      }))

      const { status, data } = await createTodo({
        title
      })

      if (status === 200) {
        set((state) => ({
          todos: state.todos.map((todo) => {
            if (todo.tempId === tempId) {
              return {
                ...todo,
                id: data.id,
              }
            }
            return todo
          })
        }))
      } else {
        get().deleteTodo(tempId)
      }
    } catch (err) {
      get().deleteTodo(tempId)
      console.log(`Error while creating todo: ${err}`)
    }
  },
  deleteTodo: (id) => {
    // TODO Call API to delete todo
    set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) }))
  },

  _toggleCompleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, is_completed: !todo.is_completed }
        }
        return todo
      })
    })),
  toggleCompleteTodo: async (id) => {
    get()._toggleCompleteTodo(id)

    try {
      const todo = get().todos.find((todo) => todo.id === id)
      let res;

      if (todo.is_completed) {
        res = await completeTodo(id)
      } else {
        res = await uncompleteTodo(id)
      }

      if (res.status !== 200) {
        get()._toggleCompleteTodo(id)
      }
    } catch {
      get()._toggleCompleteTodo(id)
    }
  },

  fetchTodos: async () => {
    const todos = await fetchTodos()
    if (todos.status === 200) {
      set({ todos: todos.data })
    }
  }
})