import TodoList from "./TodoList"

function App() {

  return (
   <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
     <TodoList todos={[]} />
   </div>
  )
}

export default App
