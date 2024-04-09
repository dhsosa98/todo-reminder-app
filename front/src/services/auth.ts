import Axios from "../config/axios";
import { ICreateUser } from "../interfaces/User/ICreateUser";
import API_URL from "../vite-env.d";


const login = async (username: string, password: string) => {
    const url = `${API_URL}api/auth/login`;   
    return await Axios.post(url, { username, password });
}

const signUpWithGoogle = async (token: string, user: any) => {
    const url = `${API_URL}api/auth/google/signup`;
    return await Axios.post(url, { token, user });
}

const signup = async (user: ICreateUser) => {
    const url = `${API_URL}api/auth/signup`;
    return await Axios.post(url, user);
}

const registerFdcToken = async (token: string) => {
    const url = `${API_URL}api/auth/fdc/register`;
    return await Axios.post(url, { token });
}

export const authService = {
    login,
    signup,
    signUpWithGoogle,
    registerFdcToken
}