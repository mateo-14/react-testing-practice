import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { user } from './mocks/data'

describe('Auth', () => { 
  it('Should render LoggedOutScreen when user is not logged in', () => {
    const screen = render(<App />)
    const loginForm = screen.getByRole('form', { name: /Login/i })
    expect(loginForm).toBeInTheDocument()
  })

  it('Should render RegisterForm when user clicks on Register button', async () => {
    const screen = render(<App />)
    const registerButton = screen.getByRole('button', { name: /Register/i })
    fireEvent.click(registerButton)

    const registerForm = await screen.findByRole('form', { name: /Register/i })
    expect(registerForm).toBeInTheDocument()
  })

  it('Should render LoginForm when user clicks on Register button and then clicks on Login button', async () => {
    const screen = render(<App />)
    const registerButton = screen.getByRole('button', { name: /Register/i })
    fireEvent.click(registerButton)

    const loginButton = await screen.findByRole('button', { name: /Login/i })
    fireEvent.click(loginButton)

    const loginForm = await screen.findByRole('form', { name: /Login/i })
    expect(loginForm).toBeInTheDocument()
  })
   
  describe('Login flow', () => {
    it('Should render LoggedInScreen when user login', async () => {
      const screen = render(<App />)
      const usernameInput = screen.getByPlaceholderText(/Username/i)
      const passwordInput = screen.getByPlaceholderText(/Password/i)
      const submitButton = screen.getByRole('button', { name: /Login/i })
      
      fireEvent.change(usernameInput, { target: { value: user.username } })
      fireEvent.change(passwordInput, { target: { value: user.password } })
      fireEvent.click(submitButton)

      const logoutButton = await screen.findByRole('button', { name: /Logout/i })
      expect(logoutButton).toBeInTheDocument()

      const todoList = screen.getByRole('list', { name: /Todo list/i })
      expect(todoList).toBeInTheDocument()
    })
  })

  describe('Register flow', () => {
    it('Should render LoginForm when user registers', async () => {
      const screen = render(<App />)
      const showRegisterButton = screen.getByRole('button', { name: /Register/i })
      fireEvent.click(showRegisterButton)

      const registerForm = await screen.findByRole('form', { name: /Register/i })
      expect(registerForm).toBeInTheDocument()

      const usernameInput = await screen.findByPlaceholderText(/Username/i)
      const passwordInput = await screen.findByPlaceholderText(/Password/i)
      const submitButton = await screen.findByRole('button', { name: /Register/i })

      fireEvent.change(usernameInput, { target: { value: user.username } })
      fireEvent.change(passwordInput, { target: { value: user.password } })
      fireEvent.click(submitButton)

      const loginForm = await screen.findByRole('form', { name: /Login/i })
      expect(loginForm).toBeInTheDocument()      
    })
  })

})