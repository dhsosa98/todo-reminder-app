import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { StyledBackButton } from "../../components/Common/Styled-components";
import styled from "styled-components";
import Header from "../../components/Common/Layout/Header";
import { useSelector } from "react-redux";
import { LOGOUT, selectAuth } from "../../features/authSlice";
import { useDispatch } from "react-redux";

export function PrivateRoute() {
  const { isAuthenticated } = useSelector(selectAuth);

  return isAuthenticated ? (
    <>
      <Header/>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
}

const StyledDiv = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;
