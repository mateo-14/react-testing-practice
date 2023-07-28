import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, waitFor } from "@testing-library/react"
import TodoList from "@/components/TodoList/TodoList"
import { useBoundStore } from "@/store/store"
import { newTodo } from "@/mocks/data"

// Mock createTodo service
vi.mock('@/services/todosService', async () => {
  const { newTodo } = await import('@/mocks/data')
  return {
    createTodo: vi.fn().mockResolvedValue({
      data: newTodo,
      status: 200
    })
  }
})

// Mock fetchTodos zustand action
const fetchTodos = vi.fn()
fetchTodos.mockResolvedValue({
  data: {
    todos: []
  }
})


const initialState = useBoundStore.getState()

beforeEach(() => {
  vi.clearAllMocks()

  useBoundStore.setState({
    ...initialState,
    fetchTodos
  }, true)
})


describe('TodoList', () => {
  it('fetchTodos should be called on mount', async () => {
    render(<TodoList />)
    await waitFor(() => {
      expect(fetchTodos).toHaveBeenCalledTimes(1)
    })
  })

  it('Add new todo', async () => {
    const screen = render(<TodoList />)

    const input = screen.getByPlaceholderText(/Add a new todo/i)
    fireEvent.change(input, { target: { value: newTodo.title } })
    fireEvent.click(screen.getByRole('button'))


    await waitFor(() => {
      expect(input).toHaveValue('')

      const createdTodo = screen.getByRole('listitem', { value: newTodo.title })
      expect(createdTodo).toBeInTheDocument()

      const todos = screen.getAllByRole('listitem')
      expect(todos).toHaveLength(1)
    })
  })

  it('Should not add empty todo', async () => {
    const screen = render(<TodoList />)

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      const todos = screen.queryAllByRole('listitem')
      expect(todos).toHaveLength(0)
    })
  })

  it('Should complete todo', async () => {
    const screen = render(<TodoList />)

    const input = screen.getByPlaceholderText(/Add a new todo/i)
    fireEvent.change(input, { target: { value: newTodo.title } })
    fireEvent.click(screen.getByRole('button'))

    const createdTodo = await screen.findByRole('listitem', { value: newTodo.title })
    expect(createdTodo).toBeInTheDocument()
    expect(createdTodo).not.toHaveClass('line-through opacity-70')

    fireEvent.click(createdTodo)

    await waitFor(() => {
      expect(createdTodo).toHaveClass('line-through opacity-70')
    })
  })
})