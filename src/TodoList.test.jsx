import { describe, expect, it } from 'vitest'
import { render } from "./utils/test-utils"
import { fireEvent, screen } from "@testing-library/react"
import TodoList from "./TodoList"

describe('TodoList', () => {
  it('Should render input', () => {
    render(<TodoList />)
    expect(screen.getByPlaceholderText(/Add a new todo/i)).toBeInTheDocument()
  })

  it('Should render add button', () => {
    render(<TodoList />)
    expect(screen.getByRole('button')).toHaveTextContent(/Add/i)
  })


  it('Add new todo and mark as completed', () => {
    render(<TodoList />)
    
    const input = screen.getByPlaceholderText(/Add a new todo/i)
    const todo = 'Learn React'
    fireEvent.change(input, { target: { value: todo } })
    fireEvent.click(screen.getByRole('button'))
    expect(input).toHaveValue('')

    const createdTodo = screen.getByText(todo)

    expect(createdTodo).toBeInTheDocument()
    expect(createdTodo).not.toHaveClass('line-through')

    fireEvent.click(createdTodo)
    expect(createdTodo).toHaveClass('line-through')
  })
})