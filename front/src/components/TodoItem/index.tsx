import { FC, SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ITodoItem } from "../../interfaces/ITodoItem";
import { deleteTodoItem } from "../../services/TodoItem";
import styled from "styled-components";

interface TodoItemProps {
  item: ITodoItem;
  handleTodoList: () => void;
}

const TodoItem: FC<TodoItemProps> = ({ item, handleTodoList }) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [todoItem, setTodoItem] = useState<ITodoItem>({ ...item });

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    console.log("here");
    const { name, value, checked, type } = e.currentTarget;
    setTodoItem({ ...todoItem, [name]: type !== "checkbox" ? value : checked });
    handleTodoList();
  };

  const handleDelete = async () => {
    await deleteTodoItem(todoItem.id);
    handleTodoList();
  };

  return (
    <StyledCard key={todoItem.id}>
      <CheckBoxWrapper>
        <CheckBox
          id={"imput-selected-" + todoItem.id}
          disabled={isDisabled}
          type="checkbox"
          name="selected"
          onChange={handleChange}
          checked={todoItem.selected}
        />
        <CheckBoxLabel htmlFor={"imput-selected-" + todoItem.id} />
      </CheckBoxWrapper>
      <p>{item.description}</p>
      <StyledDeleteButton onClick={handleDelete}>Delete</StyledDeleteButton>
      <Link to={`/todoitem/${todoItem.id}`}>
        <StyledEditButton>Edit</StyledEditButton>
      </Link>
    </StyledCard>
  );
};

export default TodoItem;

const CheckBoxWrapper = styled.div`
  position: relative;
`;
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #5290c2;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
  &:disabled + ${CheckBoxLabel}{
    cursor: not-allowed; 
  }
`;

const StyledCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  gap: 0.5rem;
  @media (min-width: 768px) {
        gap: 2rem;
    }
`;

const StyledEditButton = styled.button`
  background-color: #5290c2;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: white;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  border: none;
  cursor: pointer;
`;

const StyledDeleteButton = styled.button`
  background-color: red;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: white;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  border: none;
  cursor: pointer;
`;
