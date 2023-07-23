import LoginForm from "./components/LoginForm/LoginForm"
import useUserStore from "./stores/userStore"
import TodoList from './components/TodoList/TodoList'
import { useState } from "react"

function App() {
  const { isLoggedIn } = useUserStore()

  return (
   <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white flex-col">
      {
        !isLoggedIn ? 
        <LoggedOutScreen /> : 
        <LoggedInScreen/>
      }
   </div>
  )
}

function LoggedOutScreen() {
  const [showLoginForm, setShowLoginForm] = useState(true)

  return (
    <div className="max-w-xs w-full mx-4">
      {
        showLoginForm ? <LoginForm /> : 'Register form'
      }
      <button className="border-2 border-purple-600 py-1 rounded w-full mt-5 hover:bg-purple-600 transition" onClick={() => setShowLoginForm(!showLoginForm)}>{
        showLoginForm ? 'Register' : 'Login'
      }</button>
    </div>
  )
}

function LoggedInScreen() {
  const userStore = useUserStore()

  const handleLogout = () => {
    userStore.logout()
    localStorage.removeItem('token')
  }
  
  return (
    <>
      <button className="bg-purple-600 px-6 py-1 rounded ml-4 absolute top-5 right-5" onClick={handleLogout}>Logout</button>
      <TodoList />
    </>
  )
}
export default App
