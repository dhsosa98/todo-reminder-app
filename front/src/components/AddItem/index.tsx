import styled from "styled-components";
import { StyledAddButton, StyledBackButton, StyledErrorParagraph, StyledH3, StyledInput, StyledWrapperSection } from "../Common/Styled-components";
import { useNavigate } from "react-router-dom";
import React, { FC, FormEvent, SyntheticEvent, useState } from "react";
import { ICreateTodoItem } from "../../interfaces/TodoItem/ICreateTodoItem";
import { ActionFromReducer } from "redux";
import { ITodoItem } from "../../interfaces/TodoItem/ITodoItem";
import { createTodoItemByUser, selectTodoItems } from "../../features/todoItemsSlice";
import { useDispatch } from "react-redux";
import { createDirectoryByUser, resetError } from "../../features/directorySlice";
import { useSelector } from "react-redux";
import { IDirectory } from "../../interfaces/Directory/IDirectory";
import { ICreateDirectory } from "../../interfaces/Directory/ICreateDirectory";
import useDirectory from "../../hooks/useDirectory";
import Modal from "../Common/Modal";

type AddItemProps = {
}

const StyledWrapperSectionAddItem = styled(StyledWrapperSection)`
    display: flex;
`;

const AddItem: FC<AddItemProps> = () => {

    const navigate = useNavigate();

    const { currentDirectory } = useDirectory();

    const directory = currentDirectory as IDirectory;

    const { error } = useSelector(selectTodoItems);

    const dispatch = useDispatch();

    const selectRef = React.useRef<HTMLSelectElement>(null);

    const [description, setDescription] = useState<string>("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectRef.current) {
          return;
        }

        if (selectRef.current.value === "directory") {
            dispatch(createDirectoryByUser({
                name: description,
                parentId: directory.id,
            }) as ActionFromReducer<ICreateDirectory>);
            return;
        }
        
        dispatch(createTodoItemByUser({
            description: description,
            selected: false,
            directoryId: directory?.id as number,
        
        }) as ActionFromReducer<ITodoItem>);

        setDescription("");
      };
    
    const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        setDescription(value);
    };


    return (
        <StyledWrapperSectionAddItem>
            <StyledH3>Add Item</StyledH3>
            <AddItemForm onSubmit={handleSubmit} >
                <StyledLabel htmlFor="description">Description</StyledLabel>
                <StyledInput
                    placeholder="Go to the shop"
                    value={description}
                    onChange={handleChange}
                />
                <StyledLabel htmlFor="select">Type</StyledLabel>
                <StyledSelect defaultValue={"directory"} ref={selectRef}>
                    <option value="0" disabled>Select an item to add</option>
                    <option value="directory">Directory</option>
                    <option value="todo">Task</option>
                </StyledSelect>
                <StyledFlextContainer>
                    <StyledAddButton type="submit">Add</StyledAddButton>
                </StyledFlextContainer>
                {error && <StyledErrorParagraph>{error}</StyledErrorParagraph>}
            </AddItemForm>
        </StyledWrapperSectionAddItem>
    )
}

export default AddItem;

const StyledLabel = styled.label`
    margin-top: 10px;
    font-size: 1rem;
    color: #3a60b7;
`;

const AddItemForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;


const StyledSelect = styled.select`
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  outline-color: #3a60b7;
  @media (min-width: 768px) {
    height: 40px;
  }
`;

const StyledFlextContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  justify-content: space-between;
`;
