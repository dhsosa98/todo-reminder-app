import React, { FC } from "react";
import NotFound from "../NotFound";
import TodoItem from "../TodoItem";
import { ITodoItem } from "../../interfaces/TodoItem/ITodoItem";
import { updateTodoItemOrder } from "../../features/todoItemsSlice";
import { useDispatch } from "react-redux";
import { ActionFromReducer } from "redux";

type TodoItemListProps = {
    todoList: ITodoItem[];
}

const TodoItemList: FC<TodoItemListProps> = ({todoList}) => {

    const dispatch = useDispatch();

    const [dragItemId, setDragItemId] = React.useState<number | null>(null);
    const [dragOverItemId, setDragOverItemId] = React.useState<number | null>(null);

    const handleSort = () => {
        const newTodoList = [...todoList];
        const dragItem = newTodoList.find((item) => item.id === dragItemId);
        const dragOverItem = newTodoList.find((item) => item.id === dragOverItemId);
        if (dragItem && dragOverItem) {
          const dragItemIndex = newTodoList.indexOf(dragItem);
          const dragOverItemIndex = newTodoList.indexOf(dragOverItem);
          newTodoList.splice(dragItemIndex, 1);
          newTodoList.splice(dragOverItemIndex, 0, dragItem);
          dispatch(
            updateTodoItemOrder(newTodoList) as ActionFromReducer<ITodoItem[]>
          )
        }
        setDragItemId(null);
        setDragOverItemId(null);
    }

    const onDragStart = (e: any, id: any) => {
        const target = e.target;
        target.style.opacity = "0.5";
        e.dataTransfer.setDragImage(target, 0, 0);
        setDragItemId(id);
      };
    
    const onDragEnd = (e: any) => {
        const target = e.target;
        target.style.opacity = "1";
        handleSort();
    }

    const onDragEnter = (e: any, id: any) => {
        setDragOverItemId(id);
    }

    const onDragOver = (e: any) => {
        e.preventDefault();
    }


    return (
        <>
        {todoList?.length === 0 && (
            <NotFound title="To-do List" text="Add one with button below" />
          )}
          {todoList?.map((item) => (
            <TodoItem item={item} key={item?.id} onDragEnd={onDragEnd} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnter={onDragEnter} />
          ))}
        </>
    )
}

export default TodoItemList;