import { FC } from "react";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TodoItem from "../../components/TodoItem";
import { ICreateTodoItem } from "../../interfaces/TodoItem/ICreateTodoItem";
import { ITodoItem } from "../../interfaces/TodoItem/ITodoItem";
import styled from "styled-components";
import NotFound from "../../components/NotFound";
import Loader from "../../components/Common/Loader";
import {
  StyledAddButton,
  StyledBackButton,
  StyledContainer,
  StyledErrorParagraph,
  StyledH1,
  StyledH2,
  StyledH3,
  StyledInput,
  StyledWrapperSection,
} from "../../components/Common/Styled-components";
import { useDispatch } from "react-redux";
import { ActionFromReducer } from "redux";
import { useSelector } from "react-redux";
import {
  createTodoItemByUser,
  getTodoItemsByUser,
  resetError,
  selectTodoItems,
  setSearch,
} from "../../features/todoItemsSlice";

const Todo: FC = () => {
  const { directoryId } = useParams();
  const navigate = useNavigate();
  const initialTodoItem: ICreateTodoItem = {
    description: "",
    selected: false,
    directoryId: Number(directoryId),
  };
  const [newTodoItem, setNewTodoItem] =
    useState<ICreateTodoItem>(initialTodoItem);
  const dispatch = useDispatch();
  const { todoList, isLoading, error, directory, search } =
    useSelector(selectTodoItems);
  const { name: directoryName } = directory;

  const handleTodoList = async () => {
    dispatch(
      getTodoItemsByUser(Number(directoryId)) as ActionFromReducer<ITodoItem[]>
    );
  };

  useEffect(() => {
    handleTodoList();
    return () => {
      dispatch(resetError());
    };
  }, [dispatch, search]);

  const handleSubmit = async () => {
    dispatch(createTodoItemByUser(newTodoItem) as ActionFromReducer<ITodoItem>);
    setNewTodoItem(initialTodoItem);
  };

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setNewTodoItem({ ...newTodoItem, description: value });
    dispatch(resetError());
  };

  const handleSearch = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    dispatch(setSearch(value));
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  if (error === "Not Found") {
    return (
      <StyledCenterContainer>
        <StyledH1>Not Found</StyledH1>
        <NotFound title="Directory with that ID">
          <StyledBackButton onClick={handleNavigate}>Back</StyledBackButton>
        </NotFound>
      </StyledCenterContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledH1>To-do List</StyledH1>
      <>
        <StyledH2>
          Directories {">"} {directoryName}
        </StyledH2>
        <StyledWrapperSection>
          <StyledSearchContainer>
            <StyledInputSearch
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
            />
            <span>🔎</span>
          </StyledSearchContainer>
        </StyledWrapperSection>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <StyledDiv>
              {todoList?.length === 0 && (
                <NotFound title="To-do List" text="Add one with button below" />
              )}
              {todoList?.map((item) => (
                <TodoItem item={item} key={item?.id} />
              ))}
            </StyledDiv>
          </>
        )}
      </>
      <StyledWrapperSection>
        <StyledH3>Add Task</StyledH3>
        <StyledInput
          placeholder="Go to the shop"
          value={newTodoItem?.description}
          onChange={handleChange}
        />
        <StyledFlextContainer>
          <StyledAddButton onClick={handleSubmit}>Add</StyledAddButton>
          <StyledBackButton onClick={handleNavigate}>Back</StyledBackButton>
        </StyledFlextContainer>
        {error && <StyledErrorParagraph>{error}</StyledErrorParagraph>}
      </StyledWrapperSection>
    </StyledContainer>
  );
};

export default Todo;

const StyledSearchContainer = styled.div`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  align-items: center;
`;

const StyledInputSearch = styled.input`
  border: none;
  border-radius: 5px;
  padding: 5px;
  outline: none;
  font-size: 1.2rem;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StyledCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  font-size: 0.8rem;
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledFlextContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;
