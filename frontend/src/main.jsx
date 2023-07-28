import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { useBoundStore } from "./store/store.js"
import { check } from './services/authService.js'

if (localStorage.getItem('token')) {
  check(localStorage.getItem('token'))
    .then(({ data, status }) => {
      if (status === 200) {
        useBoundStore.getState().login(data.user)
      } else {
        localStorage.removeItem('token')
      }
    })
    .catch(err => {
      console.log(err)
      localStorage.removeItem('token')
    })
    .finally(() => {
      useBoundStore.setState({
        checkingAuth: false,
      })
    })
} else {
  useBoundStore.setState({
    checkingAuth: false,
  })
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
