import { FC } from "react";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TodoItem from "../../components/TodoItem";
import { ICreateTodoItem } from "../../interfaces/ICreateTodoItem";
import { ITodoItem } from "../../interfaces/ITodoItem";
import { getDirectory } from "../../services/directories";
import { createTodoItem } from "../../services/TodoItem";
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
import { successAlert } from "../../utilities/sweetalert";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleTodoList = async () => {
    try {
      setIsLoading(true);
      const { data } = await getDirectory(Number(directoryId));
      setTodoList(data.todoItem);
      setDirectoryName(data.name);
    } catch (err: any) {
      if (err.response.status === 404) {
        setError("Directory not found");
        return;
      }
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleTodoList();
  }, []);

  const handleSubmit = async () => {
    try {
      if (newTodoItem.description.length < 3) {
        setError("Please enter a description task of at least 3 characters");
        return;
      }
      await createTodoItem(newTodoItem);
      await successAlert("The Task has been Created Successfully");
      setNewTodoItem({
        description: "",
        selected: false,
        directoryId: Number(directoryId),
      });
      handleTodoList();
    } catch (err: any) {
      setError("Something went wrong");
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

  if (error === "Directory not found") {
    return (
      <StyledCenterContainer>
        <NotFound title="Directory with that ID" />
      </StyledCenterContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledH1>To-do List</StyledH1>
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <StyledH2>
              Directories {">"} {directoryName}
            </StyledH2>
            <StyledDiv>
              {todoList.length === 0 && (
                <NotFound title="To-do List" text="Add one with button below" />
              )}
              {todoList.map((item) => (
                <TodoItem
                  item={item}
                  handleTodoList={handleTodoList}
                  key={item.id}
                />
              ))}
            </StyledDiv>
          </>
        )}
      </>
      <StyledWrapperSection>
        <StyledH3>Add Task</StyledH3>
        <StyledInput value={newTodoItem.description} onChange={handleChange} />
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

const StyledCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
