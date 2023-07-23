import { fireEvent, render, waitFor } from '@testing-library/react'
import { describe, expect, it } from "vitest"
import LoginForm from "./LoginForm"

describe('LoginForm', () => {
  it('Renders correctly', () => {
    const screen = render(<LoginForm />)
    const usernameInput = screen.getByPlaceholderText(/Username/i)
    const passwordInput = screen.getByPlaceholderText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Login/i })
    
    expect(usernameInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
  
  it('Show error message when username is empty', async () => {
    const screen = render(<LoginForm />)
    const submitButton = screen.getByRole('button', { name: /Login/i })
    fireEvent.click(submitButton)

    const errorMessage = await screen.findByText(/Username is required/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('Show error message when password is empty', async () => {
    const screen = render(<LoginForm />)
    const submitButton = screen.getByRole('button', { name: /Login/i })
    fireEvent.click(submitButton)

    const errorMessage = await screen.findByText(/Password is required/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('Button should not be disabled when inputs are invalid', async () => {
    const screen = render(<LoginForm />)
    const submitButton = screen.getByRole('button', { name: /Login/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('Button should be disabled when is submitting', async () => {
    const screen = render(<LoginForm />)
    const submitButton = screen.getByRole('button', { name: /Login/i })
    const usernameInput = screen.getByPlaceholderText(/Username/i)
    const passwordInput = screen.getByPlaceholderText(/Password/i)

    fireEvent.change(usernameInput, { target: { value: 'username' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})