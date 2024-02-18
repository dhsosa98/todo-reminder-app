import { useSelector } from "react-redux";
import { getTodoItemById, selectTodoItems } from "../features/todoItemsSlice";
import { ActionFromReducer } from "redux";
import { ITodoItem } from "../interfaces/TodoItem/ITodoItem";
import { useDispatch } from "react-redux";
import { useEffect } from "react";


const useTodoItem = (todoItemId: number) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (!todoItemId) {
            return;
        }
        dispatch(getTodoItemById(todoItemId) as ActionFromReducer<ITodoItem>);
    }, [dispatch, todoItemId]);

    const { currentTodoItem, isLoading, error } = useSelector(selectTodoItems);

    return { currentTodoItem, isLoading, error };
}

export default useTodoItem;