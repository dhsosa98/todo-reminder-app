import Axios from "../config/axios";
import { ICreateUser } from "../interfaces/User/ICreateUser";
import API_URL from "../vite-env.d";


const login = async (username: string, password: string) => {
    const url = `${API_URL}api/auth/login`;   
    return await Axios.post(url, { username, password });
}

const signup = async (user: ICreateUser) => {
    const url = `${API_URL}api/auth/signup`;
    return await Axios.post(url, user);
}

export const authService = {
    login,
    signup
}