import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EditTodoItem from './components/EditTodoItem'
import TodoList from './components/TodoList'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<TodoList/>} />
      <Route path='/:id' element={<EditTodoItem/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
