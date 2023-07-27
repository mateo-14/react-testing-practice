import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import TodoList from "./TodoList"

describe('TodoList', () => {
  
  it('Add new todo', async () => {
    render(<TodoList />)
    
    const input = screen.getByPlaceholderText(/Add a new todo/i)
    const todo = 'Learn React'
    fireEvent.change(input, { target: { value: todo } })
    fireEvent.click(screen.getByRole('button'))


    await waitFor(() => {
      expect(input).toHaveValue('')

      const createdTodo = screen.getByRole('listitem', { value: todo })
      expect(createdTodo).toBeInTheDocument()
      
      const todos = screen.getAllByRole('listitem')
      expect(todos).toHaveLength(1)
    })
  })

  it('Should not add empty todo', async () => {
    render(<TodoList />)

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      const todos = screen.queryAllByRole('listitem')
      expect(todos).toHaveLength(0)
    })
  })

  it('Should complete todo', async () => {
    render(<TodoList />)

    const input = screen.getByPlaceholderText(/Add a new todo/i)
    const todo = 'Learn React'
    fireEvent.change(input, { target: { value: todo } })
    fireEvent.click(screen.getByRole('button'))

    const createdTodo = await screen.findByRole('listitem', { value: todo })
    expect(createdTodo).toBeInTheDocument()
    expect(createdTodo).not.toHaveClass('line-through opacity-70')

    fireEvent.click(createdTodo)
    
    await waitFor(() => {
      expect(createdTodo).toHaveClass('line-through opacity-70')
    })
  })    
})