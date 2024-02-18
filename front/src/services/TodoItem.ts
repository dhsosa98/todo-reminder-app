import Axios from "../config/axios";
import { ICreateTodoItem } from "../interfaces/TodoItem/ICreateTodoItem";
import { ITodoItem } from "../interfaces/TodoItem/ITodoItem";
import API_URL from "../vite-env.d";
const baseURL = `${API_URL}api/todoitems`;

export const getTodoList = async () => {
  return await Axios.get(`${baseURL}`);
};

export const deleteTodoItem = async (id: number) => {
  return await Axios.delete(`${baseURL}/${id}`);
};

export const updateTodoItem = async (id: number, todoItem: ITodoItem) => {
  return await Axios.put(`${baseURL}/${id}`, todoItem);
};

export const createTodoItem = async (todoItem: ICreateTodoItem) => {
    return await Axios.post(baseURL, todoItem);
};

export const getTodoItem = async (id: number) => {
  return await Axios.get(`${baseURL}/${id}`);
};

export const updateTodoItemOrder = async (todoItems: ITodoItem[]) => {
  return await Axios.post(`${baseURL}/updateOrder`, todoItems);
}

export const todoItemService = {
  getTodoList,
  deleteTodoItem,
  updateTodoItem,
  createTodoItem,
  getTodoItem,
  updateTodoItemOrder
};

