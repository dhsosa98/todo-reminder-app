import { FC, SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ITodoItem } from "../../interfaces/ITodoItem";
import { deleteTodoItem } from "../../services/TodoItem";
import styled from "styled-components";
import Toggle from "../Common/Toggle";
import {
  StyledDeleteButton,
  StyledEditButton,
  StyledH3,
} from "../Common/Styled-components";
import { deleteAlert } from "../../utilities/sweetalert";

interface TodoItemProps {
  item: ITodoItem;
  handleTodoList: () => void;
}

const TodoItem: FC<TodoItemProps> = ({ item, handleTodoList }) => {
  const [todoItem, setTodoItem] = useState<ITodoItem>({ ...item });

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.currentTarget;
    setTodoItem({ ...todoItem, [name]: type !== "checkbox" ? value : checked });
  };

  const handleDelete = async () => {
    try {
      await deleteAlert(
        "Are you sure you want to delete this Task?",
        "The task has been deleted!"
      );
      await deleteTodoItem(todoItem.id);
      handleTodoList();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <StyledCard key={todoItem.id}>
      <StyledWrapper>
        <StyledH3>Realized</StyledH3>
        <StyledH3>Description</StyledH3>
        <Toggle item={todoItem} handleChange={handleChange} isDisabled={true} />
        <ContentDescription>{item.description}</ContentDescription>
        <StyledDeleteButton onClick={handleDelete}>Delete</StyledDeleteButton>
        <ContentEdit>
          <Link to={`/todoitem/${todoItem.id}`}>
            <StyledEditButton>Edit</StyledEditButton>
          </Link>
        </ContentEdit>
      </StyledWrapper>
    </StyledCard>
  );
};

export default TodoItem;

const ContentDescription = styled.p`
  grid-area: 2 / 2 / 3 / 3;
`;

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 0.1fr);
  grid-template-rows: 30px 0.2fr;
  align-items: center;
  gap: 0.3rem;
`;

const StyledCard = styled.div`
  margin-bottom: 20px;
  background-color: white;
  color: #3a60b7;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  animation: myAnim 0.4s ease-in 0s 1 normal forwards;
  @keyframes myAnim {
    0% {
      opacity: 0;
      transform: translateX(50px);
    }

    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ContentEdit = styled.div`
  grid-area: 2 / 4 / 3 / 5;
`;
