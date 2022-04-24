import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EditTodoItem from './components/EditTodoItem'
import Directories from './routes/Directories'
import Todo from './routes/Todo'
import styled, {createGlobalStyle} from 'styled-components'

function App() {

  return (
    <BrowserRouter>
    <GlobalStyle/>
    <Routes>
      <Route path='/' element={<Directories/>} />
      <Route path='/:directoryId' element={<Todo/>} />
      <Route path='todoitem/:id' element={<EditTodoItem/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f5f5f5;
  }
`
