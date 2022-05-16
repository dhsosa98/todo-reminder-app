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
import { fetchUser, LOGIN } from "../../features/authSlice";
import { ActionFromReducer } from "redux";
import { errorAlert } from "../../utilities/sweetalert";
import * as yup from "yup";
import { ErrorMessage, Formik } from "formik";

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
            <StyledAddButton type="submit">Login</StyledAddButton>
          </StyledForm>
        </Formik>
      </StyledWrapperSection>
    </StyledContainer>
  );
};

export default Login;
