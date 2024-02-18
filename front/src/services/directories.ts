import Axios from "../config/axios";
import { ICreateDirectory } from "../interfaces/Directory/ICreateDirectory";
import API_URL from "../vite-env.d";
const baseURL = `${API_URL}api/directories`;

const getDirectories = async () => {
    return await Axios.get(baseURL)
}

const createDirectory = async (directory: ICreateDirectory) => {
    return await Axios.post(baseURL, directory)
}

const deleteDirectory = async (id: number) => {
    return await Axios.delete(`${baseURL}/${id}`)
}

const getTodoItemsByDirectoryId = async (id: number, search: string) => {
    return await Axios.get(`${baseURL}/${id}/todoitems?${search ? `search=${search}` : ""}`)
}

const getDirectory = async (id: number) => {
    return await Axios.get(`${baseURL}/${id}`)
}

const getBreadcrumbTree = async (id: number) => {
    return await Axios.get(`${baseURL}/${id}/tree`)
}

export const directoryService = {
    getDirectories,
    createDirectory,
    deleteDirectory,
    getTodoItemsByDirectoryId,
    getDirectory,
    getBreadcrumbTree
}
