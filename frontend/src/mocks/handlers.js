import { rest } from 'msw'
import { todos } from './data'

const API_URL = import.meta.env.VITE_API_URL

export const handlers = [
  rest.post(`${API_URL}/auth/login`, async (req, res, ctx) => {
    const body = await req.json()

    return res(
      ctx.status(200),
      ctx.json({
        token: 'mocked_user_token',
        username: body.username,
      }),
    )
  }),

  rest.post(`${API_URL}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(200),
    )
  }),

  rest.get(`${API_URL}/todos`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        todos
      )
    )
  }),

  rest.post(`${API_URL}/todos`, async (req, res, ctx) => {
    const body = await req.json()

    return res(
      ctx.status(200),
      ctx.json({
        title: body.title,
        completed: false,
        id: 3
      })
    )
  })
]