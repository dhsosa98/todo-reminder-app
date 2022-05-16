import { FC, SyntheticEvent, useContext, useState } from "react";
import {
  StyledAddButton,
  StyledContainer,
  StyledErrorParagraph,
  StyledForm,
  StyledFormikInput,
  StyledH1,
  StyledH6,
  StyledInput,
  StyledWrapperSection,
} from "../../components/Common/Styled-components";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";
import { errorAlert, successAlert } from "../../utilities/sweetalert";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";

interface ISignup {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
}

const SignUp: FC = () => {
  const initialValues: ISignup = {
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
  };
  const navigate = useNavigate();

  const handleSubmit = async (values: ISignup) => {
    try {
      const { username, password, name, surname } = values;
      await authService.signup({ username, password, name, surname });
      await successAlert("Success", "You have successfully signed up!");
      navigate("/login");
    } catch (err: any) {
      if (!err.response) {
        return;
      }
      await errorAlert(
        "Error",
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const SignUpSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: yup
      .string()
      .min(3, "Password must be at least 3 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Repeat the password"),
    name: yup
      .string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    surname: yup
      .string()
      .min(3, "Surname must be at least 3 characters")
      .required("Surname is required"),
  });
  return (
    <StyledContainer>
      <StyledH1>Sign-Up</StyledH1>
      <StyledWrapperSection>
        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          <StyledForm>
            <div>
            <StyledFormikInput placeholder="Username" name="username" />
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
            <div>
            <StyledFormikInput
              placeholder="Repeat Password"
              name="confirmPassword"
              type="password"
            />
            <ErrorMessage
              name="confirmPassword"
              render={(msg: any) => (
                <StyledErrorParagraph>{msg}</StyledErrorParagraph>
              )}
            />
            </div>
            <div>
            <StyledFormikInput name="name" placeholder="Name" />
            <ErrorMessage
              name="name"
              render={(msg: any) => (
                <StyledErrorParagraph>{msg}</StyledErrorParagraph>
              )}
            />
            </div>
            <div>
            <StyledFormikInput name="surname" placeholder="Surname" />
            <ErrorMessage
              name="surname"
              render={(msg: any) => (
                <StyledErrorParagraph>{msg}</StyledErrorParagraph>
              )}
            />
            </div>
            <StyledH6 to="/login">Already Register? Log-In</StyledH6>
            <StyledAddButton type="submit">Register</StyledAddButton>
          </StyledForm>
        </Formik>
      </StyledWrapperSection>
    </StyledContainer>
  );
};

export default SignUp;
