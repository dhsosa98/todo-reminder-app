import { FC } from "react";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TodoItem from "../../components/TodoItem";
import { ICreateTodoItem } from "../../interfaces/ICreateTodoItem";
import { ITodoItem } from "../../interfaces/ITodoItem";
import { getDirectory } from "../../services/directories";
import { createTodoItem } from "../../services/TodoItem";

const Todo: FC = () => {
  const { directoryId } = useParams();
  const navigate = useNavigate();
  const [todoList, setTodoList] = useState<ITodoItem[]>([]);
  const [newTodoItem, setNewTodoItem] = useState<ICreateTodoItem>({
    description: "",
    selected: false,
    directoryId: Number(directoryId),
  });
  const [error, setError] = useState<string>("");
  const [directoryName, setDirectoryName] = useState<string>("");

  const handleTodoList = async () => {
    const { data } = await getDirectory(Number(directoryId));
    console.log(data);
    setTodoList(data.todoItem);
    setDirectoryName(data.name);
  };

  useEffect(() => {
    handleTodoList();
  }, []);

  const handleSubmit = async () => {
    try {
      if (newTodoItem.description.length<3){
        setError("Please enter a description task of at least 3 characters");
        return
      }
      await createTodoItem(newTodoItem);
      handleTodoList();
    } catch (err: any) {
      
    }
  };

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setNewTodoItem({ ...newTodoItem, description: value });
    setError("");
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <>
      <h1>To-do List</h1>
      <h2>Directories {">"} {directoryName}</h2>
      {todoList.map((item) => (
        <TodoItem item={item} handleTodoList={handleTodoList} key={item.id} />
      ))}
      <input value={newTodoItem.description} onChange={handleChange} />
      <button onClick={handleSubmit}>Add</button>
      <button onClick={handleNavigate}>Back</button>
      {error && <p>{error}</p>}
    </>
  );
};

export default Todo;
