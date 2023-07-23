const API_URL = `${import.meta.env.VITE_API_URL}/auth`

export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })

  const data = await res.json()
  
  return {
    status: res.status,
    data: data
  }
}