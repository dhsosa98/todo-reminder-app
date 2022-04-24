import axios from "axios";
import { ICreateDirectory } from "../interfaces/ICreateDirectory";

import { port } from "../vite-env";
const baseURL = `http://localhost:${port}/directories`;

export const getDirectories = async () => {
    return await axios.get(baseURL)
}

export const createDirectory = async (directory: ICreateDirectory) => {
    return await axios.post(baseURL, directory)
}

export const deleteDirectory = async (id: number) => {
    return await axios.delete(`${baseURL}/${id}`)
}

export const getDirectory = async (id: number) => {
    return await axios.get(`${baseURL}/${id}`)
}