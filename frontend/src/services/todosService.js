export async function fetchTodos() {
  const token = localStorage.getItem('token')
  if (!token) {
    return {
      status: 401
    }
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const data = await res.json()

  return {
    status: res.status,
    data: data
  }
}

export async function createTodo(todo) {
  const token = localStorage.getItem('token')
  if (!token) {
    return {
      status: 401
    }
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(todo)
  })

  const data = await res.json()

  return {
    status: res.status,
    data: data
  }
}

export async function completeTodo(id) {
  const token = localStorage.getItem('token')
  if (!token) {
    return {
      status: 401
    }
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}/complete`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return {
    status: res.status
  }
}

export async function uncompleteTodo(id) {
  const token = localStorage.getItem('token')
  if (!token) {
    return {
      status: 401
    }
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}/complete`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return {
    status: res.status
  }
}

export async function deleteTodo(id) {
  const token = localStorage.getItem('token')
  if (!token) {
    return {
      status: 401
    }
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return {
    status: res.status
  }
}