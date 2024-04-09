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
      <StyledDiv>
        <Container>
          <Outlet />
        </Container>
      </StyledDiv>
    </>
  ) : (
    <Navigate to="/login" />
  );
}

const StyledDiv = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;
