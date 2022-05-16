import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import EditTodoItem from "./components/EditTodoItem";
import Directories from "./pages/Directories";
import Todo from "./pages/Todo";
import styled, { createGlobalStyle } from "styled-components";
import Login from "./pages/Login";
import { PrivateRoute } from "./routes/PrivateRoute";
import SignUp from "./pages/SignUp";
import { PublicRoute } from "./routes/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Background />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Navigate to="/directories" />} />
            <Route path="/directories" element={<Directories />} />
            <Route path="directories/:directoryId/todoitems" element={<Todo />} />
            <Route path="todoitem/:id" element={<EditTodoItem />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;


const Background = styled.div`
  background-color: #3d53c5;
  position: fixed;
  width: 100vw;
  height: 55vh;
  z-index: -1;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
