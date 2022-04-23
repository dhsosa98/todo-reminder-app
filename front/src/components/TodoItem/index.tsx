import { FC, SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ITodoItem } from "../../interfaces/ITodoItem";
import { deleteTodoItem, updateTodoItem } from "../../services/TodoItem";

interface TodoItemProps {
  item: ITodoItem;
  handleTodoList: () => void;
}

const TodoItem: FC<TodoItemProps> = ({ item, handleTodoList }) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [todoItem, setTodoItem] = useState<ITodoItem>({ ...item });

  const handleDisable = () => {
    setIsDisabled(false);
  };

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.currentTarget;
    setTodoItem({ ...todoItem, [name]: type !== "checkbox" ? value : checked });
    handleTodoList();
  };

  const handleDelete = async () => {
    await deleteTodoItem(todoItem.id);
    handleTodoList();
  };

  return (
    <div style={{ display: "flex" }} key={todoItem.id}>
      <p>{todoItem.id}</p>
        <p>{item.description}</p>
      <input
        name="selected"
        type="checkbox"
        checked={todoItem.selected}
        disabled={isDisabled}
        onChange={handleChange}
      />
      <button onClick={handleDelete}>Delete</button>
      <Link to={`/${todoItem.id}`} >Edit</Link>
    </div>
  );
};

export default TodoItem;
