import { FC } from "react";
import { SyntheticEvent, useEffect, useState } from "react";
import { ICreateTodoItem } from "../../interfaces/ICreateTodoItem";
import { ITodoItem } from "../../interfaces/ITodoItem";
import { createTodoItem, getTodoList } from "../../services/TodoItem";
import TodoItem from "../TodoItem";

const TodoList: FC = () => {
  const [todoList, setTodoList] = useState<ITodoItem[]>([]);
  const [newTodoItem, setNewTodoItem] = useState<ICreateTodoItem>({
    description: "",
    selected: false,
  });

  const handleTodoList = async () => {
    const { data } = await getTodoList();
    setTodoList(data);
  };

  useEffect(() => {
    handleTodoList();
  }, []);

  const handleSubmit = async () => {
    await createTodoItem(newTodoItem);
    handleTodoList();
  };

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setNewTodoItem({ ...newTodoItem, description: value });
  };
  return (
    <>
      <h1>To-do List</h1>
      {todoList.map((item) => (
        <TodoItem item={item} handleTodoList={handleTodoList} key={item.id} />
      ))}
      <input value={newTodoItem.description} onChange={handleChange} />
      <button onClick={handleSubmit}>Add</button>
    </>
  );
};

export default TodoList;
