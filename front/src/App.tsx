import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EditTodoItem from './components/EditTodoItem'
import Directories from './routes/Directories'
import Todo from './routes/Todo'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Directories/>} />
      <Route path='/:directoryId' element={<Todo/>} />
      <Route path='todoitem/:id' element={<EditTodoItem/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
