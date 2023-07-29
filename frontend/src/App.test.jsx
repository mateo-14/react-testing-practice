import { fireEvent, render, waitFor } from '@testing-library/react'
import {  afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { user } from './mocks/data'
import { todos as mockedTodos } from "./mocks/data"
import { useBoundStore } from "./store/store"
import { newTodo } from "./mocks/data"
import { server } from '@/mocks/server'
import { act } from "react-dom/test-utils"

useBoundStore.setState({
  checkingAuth: false
})

const initialState = useBoundStore.getState()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => {
  server.close()
})

afterEach(() => {
  server.resetHandlers()

  act(() => {
    useBoundStore.setState(initialState, true)
  })
})


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

describe('TodoList', () => {
  beforeEach(() => {
    useBoundStore.setState({
      ...useBoundStore.getState(),
      user: {
        username: user.username
      },
      isLoggedIn: true,
    }, true)
    localStorage.setItem('token', 'token')
  })

  it('Should render todo list with mocked todos', async () => {
    const screen = render(<App />)
  
    const todoList = await screen.findByRole('list', { name: /Todo list/i })
    expect(todoList).toBeInTheDocument()
    
    await waitFor(() => {
      const todos = screen.getAllByRole('listitem')
      expect(todos).toHaveLength(mockedTodos.length)
    })
  })

  it('Should add new todo', async () => {
    const screen = render(<App />)
    
    await waitFor(() => {
      const todos = screen.getAllByRole('listitem')
      expect(todos).toHaveLength(mockedTodos.length)
    })
    
    const input = screen.getByPlaceholderText(/Add a new todo/i)
    fireEvent.change(input, { target: { value: newTodo.title } })
    fireEvent.click(screen.getByRole('button', { name: /Add/i }))
    
    await waitFor(() => {
      expect(input).toHaveValue('')  
      const todos = screen.getAllByRole('listitem')
      expect(todos).toHaveLength(mockedTodos.length + 1)

      const createdTodo = screen.getAllByRole('listitem').find(todoEl => todoEl.textContent === newTodo.title)
      expect(createdTodo).toBeInTheDocument()
    })
  })
})