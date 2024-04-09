import { ITodoItem } from "../TodoItem/ITodoItem";

export interface IDirectory{
    id?: number|null;
    name: string;
    children?: IDirectory[];
    todoItem?: ITodoItem[];
    parentId?: number;
}