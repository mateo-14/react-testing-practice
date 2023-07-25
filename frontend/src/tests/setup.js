import { expect, afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers' 
import { server } from '../mocks/server'
import { act } from 'react-dom/test-utils'
import userStore from '../stores/userStore'

const initialState = userStore.getState()

expect.extend(matchers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => {
  server.close()
})

afterEach(() => {
  server.resetHandlers()
  cleanup()

  act(() => {
    userStore.setState(initialState)
  })
})
