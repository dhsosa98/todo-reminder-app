import { ITodoItem } from "../TodoItem/ITodoItem";

export interface IDirectory{
    id?: number;
    name: string;
    children?: IDirectory[];
    todoItem?: ITodoItem[];
}