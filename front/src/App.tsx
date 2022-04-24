import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditTodoItem from "./components/EditTodoItem";
import Directories from "./routes/Directories";
import Todo from "./routes/Todo";
import styled, { createGlobalStyle } from "styled-components";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Background />
      <StyledContainer>
        <Routes>
          <Route path="/" element={<Directories />} />
          <Route path="/:directoryId" element={<Todo />} />
          <Route path="todoitem/:id" element={<EditTodoItem />} />
        </Routes>
      </StyledContainer>
    </BrowserRouter>
  );
}

export default App;

const StyledContainer = styled.div`
  display: flex;
  background-color: transparent;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

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
