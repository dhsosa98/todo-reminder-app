import axios from 'axios'
import { ICreateTodoItem } from '../interfaces/ICreateTodoItem'
import { ITodoItem } from '../interfaces/ITodoItem'

const baseURL = 'http://localhost:3001/todoitems'

export const getTodoList = async () => {
    return await axios.get(`${baseURL}`)
}

export const deleteTodoItem = async (id: number) => {
    try{
    return await axios.delete(`${baseURL}/${id}`)
    }
    catch(err){
        console.log({err})
    }
}

export const updateTodoItem = async (id: number, todoItem: ITodoItem) => {
    return await axios.put(`${baseURL}/${id}`, todoItem)
}

export const createTodoItem = async (todoItem: ICreateTodoItem) => {
    return await axios.post(baseURL, todoItem)
}

export const getTodoItem = async (id: number) => {
    return await axios.get(`${baseURL}/${id}`)
}