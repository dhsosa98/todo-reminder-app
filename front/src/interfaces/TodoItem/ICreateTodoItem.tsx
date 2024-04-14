import { ITodoItem } from "./ITodoItem";

export interface ICreateTodoItem{
    description: string,
    selected: boolean, 
    directoryId: number|null,
    notification?: ITodoItem["notification"]
}