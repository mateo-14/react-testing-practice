import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import TodoList from "./TodoList"

describe('TodoList', () => {
  it('Add new todo and mark as completed', async () => {
    render(<TodoList />)
    
    const input = screen.getByPlaceholderText(/Add a new todo/i)
    const todo = 'Learn React'
    fireEvent.change(input, { target: { value: todo } })
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(input).toHaveValue('')
    })

    const createdTodo = await screen.findByText(todo)
    expect(createdTodo).not.toHaveClass('line-through')
    fireEvent.click(createdTodo)

    await waitFor(() => {
      expect(createdTodo).toHaveClass('line-through')
    })
  })
})