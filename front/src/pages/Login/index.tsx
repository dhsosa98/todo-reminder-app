import { FC, SyntheticEvent, useContext, useState } from "react";
import {
  StyledAddButton,
  StyledContainer,
  StyledErrorParagraph,
  StyledForm,
  StyledFormikInput,
  StyledH1,
  StyledH3,
  StyledH6,
  StyledInput,
  StyledWrapperSection,
} from "../../components/Common/Styled-components";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser, LOGIN, registerUserWithGoogle } from "../../features/authSlice";
import { ActionFromReducer } from "redux";
import { errorAlert } from "../../utilities/sweetalert";
import * as yup from "yup";
import { ErrorMessage, Formik } from "formik";
import { useSelector } from "react-redux";

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values: ILogin) => {
    try {
      dispatch(fetchUser({ ...values }) as ActionFromReducer<void>);
      navigate("/");
    } catch (err: any) {}
  };
  const LoginSchema = yup.object().shape({
    username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
    password: yup.string().min(3, 'Password must be at least 3 characters').required('Password is required'),
  });

  interface ILogin {
    username: string;
    password: string;
  }

  const initialValues: ILogin = {
    username: "",
    password: "",
  };

  return (
    <StyledContainer>
      <StyledH1>Login</StyledH1>
      <StyledWrapperSection>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          <StyledForm>
            <div>
            <StyledFormikInput name="username" placeholder="Username" />
            <ErrorMessage
              name="username"
              render={(msg: any) => (
                <StyledErrorParagraph>{msg}</StyledErrorParagraph>
              )}
            />
            </div>
            <div>
            <StyledFormikInput
              name="password"
              placeholder="Password"
              type={"password"}
            />
            <ErrorMessage
              name="password"
              render={(msg: any) => (
                <StyledErrorParagraph>{msg}</StyledErrorParagraph>
              )}
            />
            </div>
            <StyledH6 to="/signup">New User? Sign Up</StyledH6>
            <StyledLoginButtonContainer>
              <StyledLogginButton type="submit">Login</StyledLogginButton>
              <StyledH5>Or</StyledH5>
              <StyledGoogleButton type="button" onClick={() => dispatch(registerUserWithGoogle() as ActionFromReducer<void>)} >
                <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="google" height={18}  />
                Login with Google
              </StyledGoogleButton>
            </StyledLoginButtonContainer>
          </StyledForm>
        </Formik>
      </StyledWrapperSection>
    </StyledContainer>
  );
};

export default Login;

const StyledLoginButtonContainer = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`; 

const StyledLogginButton = styled(StyledAddButton)`
  padding: 10px 20px;
`


const StyledH5 = styled.p`
  text-align: center;
  margin: 0;
  display: flex;
`;

const StyledGoogleButton = styled.button`
  background-color: white;
  color: #3d53c5;
  border: 1px solid #3d53c5;
  border-radius: 5px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  &:hover {
    background-color: #3d53c5;
    color: white;
  }
`;