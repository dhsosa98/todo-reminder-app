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
    setIsLoading(true);
    const { data } = await getDirectory(Number(directoryId));
    setIsLoading(false);
    setTodoList(data.todoItem);
    setDirectoryName(data.name);
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
      setNewTodoItem({
        description: "",
        selected: false,
        directoryId: Number(directoryId),
      });
      handleTodoList();
    } catch (err: any) {}
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
    <StyledContainer>
      <StyledH1>To-do List</StyledH1>
      <>
        {isLoading ? (
          <StyledH3>Loading...</StyledH3>
        ) : (
          <>
            <StyledH2>
              Directories {">"} {directoryName}
            </StyledH2>
            {todoList.length === 0 && <NotFound title="To-do List" />}
            {todoList.map((item) => (
              <TodoItem
                item={item}
                handleTodoList={handleTodoList}
                key={item.id}
              />
            ))}
          </>
        )}
      </>
      <StyledInput value={newTodoItem.description} onChange={handleChange} />
      <StyledFlextContainer>
        <StyledAddButton onClick={handleSubmit}>Add</StyledAddButton>
        <StyledBackButton onClick={handleNavigate}>Back</StyledBackButton>
      </StyledFlextContainer>
      {error && <StyledParagraph>{error}</StyledParagraph>}
    </StyledContainer>
  );
};

export default Todo;

const StyledH3 = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

const StyledFlextContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

const StyledH1 = styled.h1`
  color: red;
`;
const StyledH2 = styled.h2`
  color: red;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  font-size: 0.8rem;
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StyledAddButton = styled.button`
  background-color: #5290c2;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: white;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  border: none;
`;

const StyledBackButton = styled.button`
  background-color: #c3c2c0;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: white;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  border: none;
`;

const StyledInput = styled.input`
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
`;

const StyledParagraph = styled.p`
  color: red;
`;
