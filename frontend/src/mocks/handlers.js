import { rest } from 'msw'

const API_URL = import.meta.env.VITE_API_URL

export const handlers = [
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mocked_user_token',
        username: req.body.username,
      }),
    )
  }),

  rest.post(`${API_URL}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(200),
    )
  })
]