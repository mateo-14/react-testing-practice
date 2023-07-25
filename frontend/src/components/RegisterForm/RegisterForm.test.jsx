import { afterEach, describe, expect, it, vi } from 'vitest';
import { register } from '../../services/authService'
import { fireEvent, render, waitFor } from "@testing-library/react";
import RegisterForm from "./RegisterForm";
import { user } from "../../mocks/data";

vi.mock('../../services/authService.js', () => {
  return {
    register: vi.fn()
  }
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('RegisterForm', () => {
  it('Renders correctly', () => {
    const screen = render(<RegisterForm />)
    const usernameInput = screen.getByPlaceholderText(/Username/i)
    const passwordInput = screen.getByPlaceholderText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Register/i })

    expect(usernameInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('Show error message when username is empty', async () => {
    const screen = render(<RegisterForm />)
    const submitButton = screen.getByRole('button', { name: /Register/i })
    fireEvent.click(submitButton)

    const errorMessage = await screen.findByText(/Username is required/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('Show error message when password is empty', async () => {
    const screen = render(<RegisterForm />)
    const submitButton = screen.getByRole('button', { name: /Register/i })
    fireEvent.click(submitButton)

    const errorMessage = await screen.findByText(/Password is required/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('Show error message when username is less than 3 characters', async () => {
    const screen = render(<RegisterForm />)
    const usernameInput = screen.getByPlaceholderText(/Username/i)
    const submitButton = screen.getByRole('button', { name: /Register/i })

    fireEvent.change(usernameInput, { target: { value: 'aa' } })
    fireEvent.click(submitButton)

    const errorMessage = await screen.findByText(/Username must be at least 3 characters/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('Show error message when password is less than 6 characters', async () => {
    const screen = render(<RegisterForm />)
    const passwordInput = screen.getByPlaceholderText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Register/i })

    fireEvent.change(passwordInput, { target: { value: 'aaaaa' } })
    fireEvent.click(submitButton)

    const errorMessage = await screen.findByText(/Password must be at least 6 characters/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('Button should not be disabled when inputs are invalid', async () => {
    const screen = render(<RegisterForm />)
    const submitButton = screen.getByRole('button', { name: /Register/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('Should call register function and onRegister prop when form is submitted', async () => {
    const onRegister = vi.fn()
    const screen = render(<RegisterForm onRegister={onRegister} />)
    const usernameInput = screen.getByPlaceholderText(/Username/i)
    const passwordInput = screen.getByPlaceholderText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Register/i })

    fireEvent.change(usernameInput, { target: { value: user.username } })
    fireEvent.change(passwordInput, { target: { value: user.password } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(register).toBeCalledWith(user.username, user.password)
      expect(onRegister).toBeCalledTimes(1)
    })
  })
})