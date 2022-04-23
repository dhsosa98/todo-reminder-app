import { FC, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITodoItem } from "../../interfaces/ITodoItem";
import { getTodoItem, updateTodoItem } from "../../services/TodoItem";

const EditTodoItem: FC = () => {
  const [todoItem, setTodoItem] = useState<ITodoItem>({
    id: 0,
    description: "",
    selected: false,
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  useEffect(() => {
    (async function () {
      try {
        const response = await getTodoItem(Number(id));
        setTodoItem(response.data);
      } finally {
        handleDisable();
      }
    })();
  }, []);

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.currentTarget;
    setTodoItem({ ...todoItem, [name]: type !== "checkbox" ? value : checked });
  };

  const handleDisable = () => {
    setIsDisabled(false);
  };

  const handleUpdate = async () => {
    await updateTodoItem(todoItem.id, todoItem);
    navigate(-1);
  };

  const handleNavigate = () => {
    navigate(-1);
  };
  return (
    <>
      <h1>Editing Task "{todoItem.description}"</h1>
      <input
        name="description"
        checked={todoItem.selected}
        value={todoItem.description ? todoItem.description : ""}
        onChange={handleChange}
        disabled={isDisabled}
      />
      <input
        name="selected"
        type="checkbox"
        checked={todoItem.selected}
        disabled={isDisabled}
        onChange={handleChange}
      />
      <button onClick={handleUpdate}>Save</button>
      <button onClick={handleNavigate}>Cancel</button>
    </>
  );
};

export default EditTodoItem;
