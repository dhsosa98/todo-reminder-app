import { FC, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITodoItem } from "../../interfaces/ITodoItem";
import { getTodoItem, updateTodoItem } from "../../services/TodoItem";
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

const EditTodoItem: FC = () => {
  const [todoItem, setTodoItem] = useState<ITodoItem>({
    id: -1,
    description: "",
    selected: false,
    directoryId: -1,
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async function () {
      try {
        setIsLoading(true);
        const response = await getTodoItem(Number(id));
        setTodoItem(response.data);
      } catch (err: any) {
        setError("Something went wrong");
      } finally {
        handleDisable();
        setIsLoading(false);
      }
    })();
  }, []);

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.currentTarget;
    setTodoItem({ ...todoItem, [name]: type !== "checkbox" ? value : checked });
    setError("");
  };

  const handleDisable = () => {
    setIsDisabled(false);
  };

  const handleUpdate = async () => {
    try {
      if (todoItem.description.length < 3) {
        setError("Please enter a description task of at least 3 characters");
        return;
      }
      await updateTodoItem(todoItem.id, todoItem);
      navigate(-1);
    } catch (err: any) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <StyledContainer>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <StyledH1>Editing Task "{todoItem.description}"</StyledH1>
          <StyledCard>
            <Toggle
              item={todoItem}
              handleChange={handleChange}
              isDisabled={isDisabled}
            />
            <StyledInput
              name="description"
              checked={todoItem.selected}
              value={todoItem.description ? todoItem.description : ""}
              onChange={handleChange}
              disabled={isDisabled}
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
  background: #fafafa;
`;

const StyledContainer = styled.div`
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
