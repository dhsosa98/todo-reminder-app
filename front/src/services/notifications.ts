import Axios from "../config/axios";
import { IUserNotification } from "../interfaces/User/IUserNotification";
import API_URL from "../vite-env.d";
const baseURL = `${API_URL}api/notifications`;

export const getNotifications = async () => {
    return await Axios.get(`${baseURL}`);
}

export const markAsRead = async (ids: number[]) => {
    return await Axios.post(`${baseURL}/read`, {ids});
}


