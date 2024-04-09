import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import EditTodoItem from "./components/EditTodoItem";
import Directories from "./pages/Directories";
import Todo from "./pages/Todo";
import styled, { createGlobalStyle } from "styled-components";
import Login from "./pages/Login";
import { PrivateRoute } from "./routes/PrivateRoute";
import SignUp from "./pages/SignUp";
import { PublicRoute } from "./routes/PublicRoute";

import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./config/firebase";
import { useEffect } from "react";

import { ToastContainer, toast, Icons } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerFdcToken, selectAuth } from "./features/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import './global.css';
import FullTree from "./pages/FullTree";

const { VITE_APP_VAPID_KEY } = import.meta.env;

async function requestPermission(dispatch: any) {

    console.log("Requesting permission...");
    //requesting permission using Notification API
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: VITE_APP_VAPID_KEY,
      });

      dispatch(registerFdcToken(token));

      //We can send token to server
      console.log("Token generated : ", token);
    } else if (permission === "denied") {
      //notifications are blocked
      // alert("You denied for the notification");
    }
}



function App() {

  const {isAuthenticated} = useSelector(selectAuth);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated) return;
    requestPermission(dispatch);
  }, [isAuthenticated, dispatch]);

  onMessage(messaging, (payload: any) => {
    console.log("Message received. ", payload);
    // ...
    toast(payload.notification.title + ' ' + payload.notification.body, {
      type: 'info',
      theme: 'colored',
      position: 'bottom-right',
    });
  });

  return (
    <BrowserRouter>
      <GlobalStyle />
      <ToastContainer />
      {/* <Background /> */}
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Todo />} />
            <Route path="/directories/:id" element={<Todo />} />
            <Route path="/todoitem/:id" element={<EditTodoItem />} />
            <Route path='/fullTree' element={<FullTree />} />
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
