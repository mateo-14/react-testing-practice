import { fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LoginForm from './LoginForm'
import { login } from '@/services/authService.js'
import { user } from '@/mocks/data'

vi.mock('@/services/authService.js', () => {
  const login = vi.fn()
  login.mockResolvedValue({
    data: {
    },
    status: 200
  })

  return {
    login
  }
})

afterEach(() => {
  vi.clearAllMocks()
})

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

  it('Button should be disabled when is submitting and login should be called', async () => {
    const screen = render(<LoginForm />)
    const submitButton = screen.getByRole('button', { name: /Login/i })
    const usernameInput = screen.getByPlaceholderText(/Username/i)
    const passwordInput = screen.getByPlaceholderText(/Password/i)

    fireEvent.change(usernameInput, { target: { value: user.username } })
    fireEvent.change(passwordInput, { target: { value: user.password } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(login).toBeCalledWith(user.username, user.password)
      expect(submitButton).toBeDisabled()
    })
  })
})