import { expect, afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers' 
import { server } from '@/mocks/server'
import { act } from 'react-dom/test-utils'
import { useBoundStore } from '@/store/store'

expect.extend(matchers)

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
  cleanup()

  act(() => {
    useBoundStore.setState(initialState, true)
  })
})
