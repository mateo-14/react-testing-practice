import LoginForm from "./components/LoginForm/LoginForm"
import useUserStore from "./stores/userStore"
import TodoList from './components/TodoList/TodoList'
import { useRef, useState } from "react"
import RegisterForm from "./components/RegisterForm/RegisterForm"
import { CSSTransition } from 'react-transition-group'

function App() {
  const { isLoggedIn } = useUserStore()

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white flex-col relative overflow-x-hidden">
      {
        !isLoggedIn ?
          <LoggedOutScreen /> :
          <LoggedInScreen />
      }
    </div>
  )
}

function LoggedOutScreen() {
  const [showLoginForm, setShowLoginForm] = useState(true)
  const loginRef = useRef(null)
  const registerRef = useRef(null)

  const handleRegister = () => {
    setShowLoginForm(true)
  }

  return (
    <>
      <CSSTransition in={showLoginForm} timeout={300} nodeRef={loginRef} unmountOnExit classNames="login">
        <div className="flex justify-center items-center w-full h-full" ref={loginRef}>
          <div className="max-w-xs w-full mx-4">
            <LoginForm />
            <p className="mt-2">{'You don\'t have an account? '}<button className="text-purple-600" onClick={() => setShowLoginForm(false)}>Register</button></p>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition in={!showLoginForm} timeout={300} nodeRef={registerRef} unmountOnExit classNames="register">
        <div className="flex justify-center items-center w-full h-full" ref={registerRef}>
          <div className="max-w-xs w-full mx-4">
            <RegisterForm onRegister={handleRegister} />

            <p className="mt-2">{'You already have an account? '}<button className="text-purple-600" onClick={() => setShowLoginForm(true)}>Login</button></p>
          </div>
        </div>
      </CSSTransition>
    </>
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
