import React, { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ITodoItem } from "../../interfaces/TodoItem/ITodoItem";
import styled from "styled-components";
import Toggle from "../Common/Toggle";
import {
  StyledDeleteButton,
  StyledEditButton,
  StyledH3,
} from "../Common/Styled-components";
import { deleteAlert, successAlert } from "../../utilities/sweetalert";
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
import dragSrc from '/drag.svg';
import { setIsOpenedModal } from "../../features/directorySlice";
import handleErrors from "../../utilities/errors";
import useSearch from "../../hooks/useSearch";
import { selectSearch } from "../../features/searchSlice";

interface TodoItemProps {
  item: ITodoItem;
  onDragStart?: (e: any, index: any) => void;
  onDragEnd?: (e: any) => void;
  onDragEnter?: (e: any, index: any) => void;
  onDragOver?: (e: any) => void;
  draggingId?: number|null;
  groupIds?: number[];
}

const TodoItem: FC<TodoItemProps> = ({ item, draggingId, groupIds }) => {
  const dispatch = useDispatch();

  const isBelongsToGroup = groupIds?.includes(draggingId!) || false;

  const handleChange = (e: SyntheticEvent<any>) => {
    dispatch(
      updateSelected({
        ...item,
        selected: !item?.selected,
      }) as ActionFromReducer<ITodoItem>
    );
  };

  const handleDelete = async () => {
    dispatch(deleteTodoItemById(item?.id) as ActionFromReducer<number>);
  };

  const lastUpdateText = new Date(item?.updatedAt).toLocaleString('en-US', {
    weekday: 'short', // represents the day of the week like "Tue"
    day: '2-digit', // represents the day of the month as two digits
    month: 'short', // represents the month in three-letter format
    year: 'numeric', // represents the year as four digits
    hour: '2-digit', // represents the hour
    minute: '2-digit', // represents the minute
  });

  const createdText = new Date(item?.createdAt).toLocaleString('en-US', {
    weekday: 'short', // represents the day of the week like "Tue"
    day: '2-digit', // represents the day of the month as two digits
    month: 'short', // represents the month in three-letter format
    year: 'numeric', // represents the year as four digits
  });

  const [isOpened, setIsOpened] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      event.stopPropagation();
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setIsOpened(false);
      }
    }
  
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleEdit = (e: any)  => {
    e.stopPropagation();
    setIsOpened(false);
    dispatch(setTodoItem(item));
    dispatch(setIsOpenedModal(true));
  }


  const { search } = useSelector(selectSearch)

  return (
    <StyledCard isDragZone={isBelongsToGroup} isDraggignId={draggingId===item.id} id={'task-'+item.id}>
      {!search && <DragIcon className="drag-handle" src={dragSrc} style={{width: "20px", height: "20px"}}/>}
      <TodoItemContainer>
      <RighTopCorner ref={menuRef}>
        <Icon className="fi fi-bs-menu-dots-vertical" onClick={
          (event) => {
            event.stopPropagation();
            setIsOpened(!isOpened)
          }
          }>
        </Icon>
        {isOpened && (
          <Menu>
            <MenuItem onClick={handleEdit}>
              Edit
              {/* <StyledLink to={`/todoitem/${item?.id}`}>
                Edit
              </StyledLink> */}
            </MenuItem>
            <MenuItemDelete onClick={handleDelete}>Delete</MenuItemDelete>
          </Menu>
        )}
      </RighTopCorner>
      <StyledWrapper onClick={handleChange}>
          <input
            type="checkbox"
            checked={item?.selected}
            onChange={handleChange}
            id="checkbox"
            style={{cursor: "pointer", margin: "0px"}}
          />
        <ContentDescription completed={item?.selected}>
          {item?.description}
        </ContentDescription>
      </StyledWrapper>
      {(item?.notification?.active) && (
        <StyledWrapperColumn>
            <StyledH4>            
              <i className="fi fi-rr-alarm-clock" style={{marginRight: "4px"}}></i>
              {item?.notification?.schedule.charAt(0).toUpperCase() + item?.notification?.schedule.slice(1)}            
            </StyledH4>
        </StyledWrapperColumn>
      )}
      <TimestampText>{createdText}</TimestampText>
      </TodoItemContainer>
    </StyledCard>
  );
};

export default TodoItem;

const DragIcon = styled.img`
  &:hover {
    cursor: grab;
    background-color: #f2f2f2;
    border-radius: 5px;
  }
`;

const TodoItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
  flex-grow: 1;  
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const Icon = styled.i`
  cursor: pointer;
  padding: 5px;
  &:hover {
    background-color: #f2f2f2;
    border-radius: 5px;
  }
`;

const MenuItem = styled.li`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    font-weight: 500;
  }
`;

const MenuItemDelete = styled(MenuItem)`
  &:hover {
    color: red;
  }
`;

const Menu = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: absolute;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 100;
  top: 10px;
  font-size: 0.8rem;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  list-style: none;
`;

const CardHeader = styled.div`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  width: 100%;
`;

const RighTopCorner = styled.div`
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  right: 4px;
`;

const TimestampText = styled.h6`
  margin: 0 !important;
  padding: 0;
  text-align: right;
  font-size: 0.6rem;
  font-weight: 400;
`;

const TimestampContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
`;

const ContainerCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledH4 = styled.h4`
  font-size: 0.6rem;
  font-weight: 100;
  margin: 0;
`;

const ContentDescription = styled.p<{completed: boolean}>`
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  font-weight: ${(props) => (props.completed ? "100" : "500")};
  font-size: 1rem;
  margin: 0;
`;

const StyledWrapper = styled.div`
  display: flex;
  font-size: 0.8rem;
  gap: 0.5rem;
  flex-grow: 1;
  align-items: center;
  cursor: pointer;
`;

const StyledWrapperColumn = styled(StyledWrapper)`
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const StyledCard = styled.div<{isDragZone: boolean, isDraggignId: boolean}>`
  margin-bottom: 20px;
  flex: 1;
  list-style: none;
  background-color: ${(props) => (props.isDragZone ? "#f2f2f2" : "white")};
  border: ${(props) => (props.isDragZone ? "2px dashed #ccc" : "1px solid #ccc")};
  padding: 10px;
  min-width: 200px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);  
  position: relative;
  display: flex;
  opacity: ${(props) => (props.isDraggignId ? "0" : "1")};
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const ContentEdit = styled.div`
  grid-area: 2 / 4 / 3 / 5;
`;

const ContentDelete = styled.div`
  grid-area: 2 / 5 / 3 / 6;
`;
