import { create } from 'zustand'
import { createUserSlice } from './userSlice'
import { createTodosSlice } from './todosSlice'

export const useBoundStore = create((...a) => ({
  ...createUserSlice(...a),
  ...createTodosSlice(...a),
}))
