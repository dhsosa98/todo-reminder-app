import Axios from "../config/axios";
import { ICreateDirectory } from "../interfaces/Directory/ICreateDirectory";
import { IDirectory } from "../interfaces/Directory/IDirectory";
import { IUpdateDirectory } from "../interfaces/Directory/IUpdateDirectory";
import API_URL from "../vite-env.d";
const baseURL = `${API_URL}api/directories`;

const getDirectories = async (search?: string) => {
    return await Axios.get(baseURL+`?${search ? `search=${search}` : ""}`)
}

const getBySearchDirectories = async (search: string) => {
    return await Axios.get(baseURL+`/search?${search ? `q=${search}` : ""}`)
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

const getDirectory = async (id: number|null) => {
    return await Axios.get(`${baseURL}/${id}`)
}

const getBreadcrumbTree = async (id: number) => {
    return await Axios.get(`${baseURL}/${id}/tree`)
}

const getBaseDirectories = async () => {
    return await Axios.get(`${baseURL}/base`)
}

const getFullTree = async () => {
    return await Axios.get(`${baseURL}/fullTree`)
}

const updateDirectory = async (id: number, directory: Partial<IDirectory>) => {
    return await Axios.post(`${baseURL}/${id}`, directory)
}

export const directoryService = {
    getDirectories,
    getBySearchDirectories,
    createDirectory,
    updateDirectory,
    deleteDirectory,
    getTodoItemsByDirectoryId,
    getDirectory,
    getFullTree,
    getBreadcrumbTree,
    getBaseDirectories
}
