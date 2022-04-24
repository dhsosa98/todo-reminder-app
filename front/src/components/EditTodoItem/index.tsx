import { FC, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITodoItem } from "../../interfaces/ITodoItem";
import { getTodoItem, updateTodoItem } from "../../services/TodoItem";
import styled from "styled-components";

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
  useEffect(() => {
    (async function () {
      try {
        const response = await getTodoItem(Number(id));
        setTodoItem(response.data);
      }
       finally {
        handleDisable();
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
    if (todoItem.description.length < 3) {
      setError("Please enter a description task of at least 3 characters");
      return;
    }
    await updateTodoItem(todoItem.id, todoItem);
    navigate(-1);
  };

  const handleNavigate = () => {
    navigate(-1);
  };
  return (
    <StyledContainer>
      <StyledH1>Editing Task "{todoItem.description}"</StyledH1>
      <StyledCard>
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
      <StyledInput
        name="description"
        checked={todoItem.selected}
        value={todoItem.description ? todoItem.description : ""}
        onChange={handleChange}
        disabled={isDisabled}
      />
      <StyledSaveButton onClick={handleUpdate}>Save</StyledSaveButton>
      <StyledBackButton onClick={handleNavigate}>Cancel</StyledBackButton>
      </StyledCard>
      {error && <StyledParagraph>{error}</StyledParagraph>}
    </StyledContainer>
  );
};

export default EditTodoItem;


const StyledH1 = styled.h1`
  color: red;
  text-align: center;
`;

const StyledInput = styled.input`
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
    max-width: 200px;
    @media (min-width: 768px) {
        max-width: 100%;
    }
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


const StyledBackButton = styled.button`
  background-color: #989796;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: white;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  border: none;
`;

const StyledSaveButton = styled.button`
  background-color: #5290c2;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: white;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  border: none;
`;


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

const StyledParagraph = styled.p`
  color: red;
`;