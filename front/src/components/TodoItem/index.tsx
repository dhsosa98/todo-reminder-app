import React, { FC, SyntheticEvent, useEffect, useState } from "react";
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
import Draggable from "react-draggable";
import useTodoItem from "../../hooks/useTodoItem";

interface TodoItemProps {
  item: ITodoItem;
  onDragStart: (e: any, index: any) => void;
  onDragEnd: (e: any) => void;
  onDragEnter: (e: any, index: any) => void;
  onDragOver: (e: any) => void;
}

const TodoItem: FC<TodoItemProps> = ({ item, onDragEnd, onDragStart, onDragOver, onDragEnter }) => {
  const dispatch = useDispatch();

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    dispatch(
      updateSelected({
        ...item,
        selected: checked,
      }) as ActionFromReducer<ITodoItem>
    );
  };

  const handleDelete = async () => {
    dispatch(deleteTodoItemById(item?.id) as ActionFromReducer<ITodoItem>);
  };

  return (
    <StyledCard key={item?.id} draggable onDragStart={(e) => onDragStart(e, item?.id)} onDragEnd={onDragEnd} onDragEnter={(e) => onDragEnter(e, item?.id)} onDragOver={onDragOver}>
      <StyledWrapper>
        <StyledH4>Completed</StyledH4>
        <StyledH4>Description</StyledH4>
        <ContainerCenter>
          <Toggle
            item={item}
            handleChange={handleChange}
            isDisabled={false}
          />
        </ContainerCenter>
        <ContentDescription>{item?.description}</ContentDescription>
        <ContentEdit>
          <Link to={`/todoitem/${item?.id}`}>
            <StyledEditButton>Edit</StyledEditButton>
          </Link>
        </ContentEdit>
        <ContentDelete>
          <StyledDeleteButton onClick={handleDelete}>Delete</StyledDeleteButton>
        </ContentDelete>
      </StyledWrapper>
    </StyledCard>
  );
};

export default TodoItem;

const ContainerCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-area: 2 / 1 / 2 / 1;
`;

const StyledH4 = styled.h4`
  color: #3d53c5;
  text-align: center;
`;

const ContentDescription = styled.p`
  grid-area: 2 / 2 / 3 / 3;
`;

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 0.1fr);
  grid-template-rows: repeat(2, 0.1fr);
  align-items: center;
  font-size: 0.8rem;
  gap: 0.5rem;
  grid-template-areas: 
    "a b . ."
    "c d e f";
`;

const StyledCard = styled.div`
  margin-bottom: 20px;
  background-color: white;
  color: #3a60b7;
  padding: 10px;
  min-height: 150px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);  
  cursor: grab;
`;

const ContentEdit = styled.div`
  grid-area: 2 / 4 / 3 / 5;
`;

const ContentDelete = styled.div`
  grid-area: 2 / 5 / 3 / 6;
`;
