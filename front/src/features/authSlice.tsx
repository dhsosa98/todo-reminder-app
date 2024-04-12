import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { ILoginUser } from "../interfaces/User/ILoginUser";
import { authService } from "../services/auth";
import { errorAlert } from "../utilities/sweetalert";
import { singInWithGoogle } from "../config/providers";

export const fetchUser = createAsyncThunk<void, ILoginUser>(
  "auth/fetchUser",
  async ({ username, password }, { dispatch }) => {
    try {
      const { data } = await authService.login(username, password);
      if (!data.access_token){
        return
      }
      dispatch(LOGIN({ user: username, jwt: data.access_token }));
    } catch (err: any) {
      if (err?.response?.status === 401) {
      await errorAlert("Invalid Credentials", "Please try again");
      return
      }
      await errorAlert("Something Wrong", "Please try again");
    }
  }
);

export const registerUserWithGoogle = createAsyncThunk<void, string|undefined>(
  "auth/registerUserWithGoogle",
  async (token = '', { dispatch }) => {
    try {
      const {token, user} = await singInWithGoogle();
      const { data } = await authService.signUpWithGoogle(token, user);
      if (!data.access_token){
        return
      }
      dispatch(LOGIN({ user: data.user, jwt: data.access_token }));
    } catch (err: any) {
      if (err?.response?.status === 401) {
      await errorAlert("Invalid Credentials", "Please try again");
      return
      }
      console.log(err)
      await errorAlert("Something Wrong", "Please try again");
    }
  }
);

export const registerFdcToken = createAsyncThunk<void, string>(
  "auth/registerFdcToken",
  async (token, { dispatch }) => {
    try {
      await authService.registerFdcToken(token);
      dispatch(setDeviceToken(token));
    } catch (err: any) {
      await errorAlert("Something Wrong", "Please try again");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user") || "",
    isAuthenticated: localStorage.getItem("jwt") ? true : false,
    deviceToken: localStorage.getItem("deviceToken") || "",
  },
  reducers: {
    LOGIN: (state, action: PayloadAction<any>) => {
      state.user = action.payload.user;
      localStorage.setItem("user", action.payload.user);
      localStorage.setItem("jwt", action.payload.jwt);
      state.isAuthenticated = true;
    },
    setDeviceToken: (state, action: PayloadAction<string>) => {
      state.deviceToken = action.payload;
      localStorage.setItem("deviceToken", action.payload);
    },
    LOGOUT: (state) => {
      state.user = "";
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      state.isAuthenticated = false;
    },
  },
});

export const { LOGIN, LOGOUT, setDeviceToken } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
