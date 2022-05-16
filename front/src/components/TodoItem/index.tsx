import { FC, SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ITodoItem } from "../../interfaces/TodoItem/ITodoItem";
import styled from "styled-components";
import Toggle from "../Common/Toggle";
import {
  StyledDeleteButton,
  StyledEditButton,
  StyledH3,
} from "../Common/Styled-components";
import { deleteAlert } from "../../utilities/sweetalert";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  deleteTodoItemById,
  selectTodoItems,
  setTodoItem,
  updateSelected,
  updateTodoItemById,
} from "../../features/todoItemsSlice";
import { ActionFromReducer } from "redux";

interface TodoItemProps {
  item: ITodoItem;
}

const TodoItem: FC<TodoItemProps> = ({ item }) => {
  const [todoItem, setTodoItem] = useState<ITodoItem>(item);
  const dispatch = useDispatch();

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    setTodoItem({ ...todoItem, selected: checked });
    dispatch(
      updateSelected({
        ...todoItem,
        selected: checked,
      }) as ActionFromReducer<ITodoItem>
    );
  };

  const handleDelete = async () => {
    dispatch(deleteTodoItemById(todoItem?.id) as ActionFromReducer<ITodoItem>);
  };

  return (
    <StyledCard key={todoItem?.id}>
      <StyledWrapper>
        <StyledH3>Realized</StyledH3>
        <StyledH3>Description</StyledH3>
        <Toggle
          item={todoItem}
          handleChange={handleChange}
          isDisabled={false}
        />
        <ContentDescription>{item?.description}</ContentDescription>
        <StyledDeleteButton onClick={handleDelete}>Delete</StyledDeleteButton>
        <ContentEdit>
          <Link to={`/todoitem/${todoItem?.id}`}>
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
