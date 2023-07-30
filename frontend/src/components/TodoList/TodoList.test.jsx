import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, waitFor, within } from "@testing-library/react"
import TodoList from "@/components/TodoList/TodoList"
import { useBoundStore } from "@/store/store"
import { newTodo } from "@/mocks/data"
import { act } from "react-dom/test-utils"
import { fetchTodos, createTodo } from "@/services/todosService"

vi.mock('@/services/todosService', async () => {
  const { newTodo } = await import('@/mocks/data')

  return {
    fetchTodos: vi.fn().mockResolvedValue([]),
    createTodo: vi.fn().mockResolvedValue({
      data: newTodo,
      status: 200
    }),
    completeTodo: vi.fn().mockResolvedValue({
      status: 200
    }),
    uncompleteTodo: vi.fn().mockResolvedValue({
      status: 200
    }),
    deleteTodo: vi.fn().mockResolvedValue({
      status: 200
    }),
  }
})

beforeEach(() => {
  vi.clearAllMocks()
})

const initialState = useBoundStore.getState()
afterEach(() => {
  act(() => {
    useBoundStore.setState(initialState, true)
  })
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
    expect(createTodo).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(input).toHaveValue('')

      const createdTodo = screen.getByRole('listitem')
      const { getByText } = within(createdTodo)
      expect(getByText(newTodo.title)).toBeInTheDocument()

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

  it('Should complete and uncomplete todo', async () => {
    const screen = render(<TodoList />)

    const input = screen.getByPlaceholderText(/Add a new todo/i)
    fireEvent.change(input, { target: { value: newTodo.title } })
    fireEvent.click(screen.getByRole('button'))

    const createdTodo = await screen.findByRole('listitem')
    expect(createdTodo).not.toHaveClass('line-through opacity-70')
    fireEvent.click(createdTodo)

    await waitFor(() => {
      expect(createdTodo).toHaveClass('line-through opacity-70')
    })

    fireEvent.click(createdTodo)
    await waitFor(() => {
      expect(createdTodo).not.toHaveClass('line-through opacity-70')
    })
  })

  it('Should delete todo', async () => {
    const screen = render(<TodoList />)

    const input = screen.getByPlaceholderText(/Add a new todo/i)
    fireEvent.change(input, { target: { value: newTodo.title } })
    fireEvent.click(screen.getByRole('button'))

    const createdTodo = await screen.findByRole('listitem')
    const { getByRole } = within(createdTodo)

    const deleteBtn = getByRole('button', { name: /Delete todo/i })
    fireEvent.click(deleteBtn)
    expect(createdTodo).not.toHaveClass('line-through opacity-70')
    fireEvent.click(createdTodo)

    await waitFor(() => {
      const todos = screen.queryAllByRole('listitem')
      expect(todos).toHaveLength(0)
    })
  })
})