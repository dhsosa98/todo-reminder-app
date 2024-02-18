import { FC, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITodoItem } from "../../interfaces/TodoItem/ITodoItem";
import { todoItemService } from "../../services/TodoItem";
import styled from "styled-components";
import Loader from "../Common/Loader";
import Toggle from "../Common/Toggle";
import {
  StyledAddButton,
  StyledBackButton,
  StyledErrorParagraph,
  StyledH1,
  StyledInput,
} from "../Common/Styled-components";
import NotFound from "../NotFound";
import { useDispatch } from "react-redux";
import {
  getTodoItemById,
  selectTodoItems,
  setTodoItem,
  updateTodoItemById,
} from "../../features/todoItemsSlice";
import { ActionFromReducer } from "redux";
import { useSelector } from "react-redux";
import { resetError } from "../../features/todoItemsSlice";
import useTodoItem from "../../hooks/useTodoItem";

const EditTodoItem: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentTodoItem: todoItem, error, isLoading } = useTodoItem(Number(id));

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.currentTarget;
    dispatch(
      setTodoItem({
        ...todoItem,
        [name]: type === "checkbox" ? checked : value,
      })
    );
    dispatch(resetError());
  };

  const handleUpdate = async () => {
    await dispatch(
      updateTodoItemById({
        id: Number(id),
        todoItem,
      }) as ActionFromReducer<ITodoItem>
    );
    handleNavigate();
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  if (error === "Not Found") {
    return (
      <StyledContainer>
        <StyledH1>Not Found</StyledH1>
        <NotFound title="To-do item with that ID">
          <StyledBackButton onClick={handleNavigate}>Back</StyledBackButton>
        </NotFound>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <StyledH1>Editing Task "{todoItem?.description}"</StyledH1>
          <StyledCard>
            <StyledInput
              name="description"
              checked={todoItem?.selected}
              value={todoItem?.description || ""}
              onChange={handleChange}
              disabled={isLoading}
            />
            <StyledWrapper>
              <StyledAddButton onClick={handleUpdate}>Save</StyledAddButton>
              <StyledBackButton onClick={handleNavigate}>
                Cancel
              </StyledBackButton>
            </StyledWrapper>
          </StyledCard>
          {error && <StyledErrorParagraph>{error}</StyledErrorParagraph>}
        </>
      )}
    </StyledContainer>
  );
};

export default EditTodoItem;

const StyledWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const StyledCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  margin: 10px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  animation: myAnim 0.4s ease-in 0s 1 normal forwards;
  @keyframes myAnim {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  font-size: 0.8rem;
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;
