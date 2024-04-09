import styled from "styled-components";
import {
  StyledAddButton,
  StyledBackButton,
  StyledErrorParagraph,
  StyledH3,
  StyledInput,
  StyledWrapperSection,
} from "../Common/Styled-components";
import { useNavigate } from "react-router-dom";
import React, { FC, FormEvent, SyntheticEvent, useEffect, useRef, useState } from "react";
import { ICreateTodoItem } from "../../interfaces/TodoItem/ICreateTodoItem";
import { ActionFromReducer } from "redux";
import { ITodoItem } from "../../interfaces/TodoItem/ITodoItem";
import {
  createTodoItemByUser,
  initiaTaskslState,
  selectTodoItems,
  setTodoItem,
  updateTodoItemById,
} from "../../features/todoItemsSlice";
import { useDispatch } from "react-redux";
import directorySlice, {
  createDirectoryByUser,
  initialDirectoryState,
  resetError,
  selectDirectory,
  setEditableDirectory,
  setIsOpenedModal,
  updateDirectory,
} from "../../features/directorySlice";
import { useSelector } from "react-redux";
import { IDirectory } from "../../interfaces/Directory/IDirectory";
import { ICreateDirectory } from "../../interfaces/Directory/ICreateDirectory";
import useDirectory from "../../hooks/useDirectory";
import Modal from "../Common/Modal";
import { IUpdateDirectory } from "../../interfaces/Directory/IUpdateDirectory";
import EditableNotificationSection from "../EditTodoItem";
import { updateTodoItem } from "../../services/TodoItem";

type AddItemProps = {
    handleClose: () => void;
    type: 'directory' | 'task' | '';
};

const StyledWrapperSectionAddItem = styled(StyledWrapperSection)`
  display: flex;
`;

const AddItemModal = ({
    type,
    }: {
    type: 'directory' | 'task' | '';
}) => {

    const { isOpenedModal: isOpen } = useSelector(selectDirectory);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
      
        // Clean up function
        return () => {
          document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleClose = () => {
        dispatch(setIsOpenedModal(false));
        dispatch(setTodoItem(initiaTaskslState.currentTodoItem));
        dispatch(setEditableDirectory(initialDirectoryState.editableDirectory));
    }


    
    
  return (
    <>
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "1em",
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto",
              borderRadius: "5px",
              zIndex: 100,
            }}
          >
            <AddItem handleClose={handleClose} type={type} />
          </div>
        </div>
      )}
    </>
  );
};

const AddItem: FC<AddItemProps> = ({handleClose, type}) => {
  const navigate = useNavigate();

  const { currentDirectory } = useDirectory();

  const directory = currentDirectory as IDirectory;

  const { error, currentTodoItem } = useSelector(selectTodoItems);

  const { editableDirectory } = useSelector(selectDirectory);

  const isEdit = editableDirectory?.id || currentTodoItem?.id

  const isDirectory = type === "directory" || editableDirectory?.id;

  const dispatch = useDispatch();

  const [description, setDescription] = useState<string>(editableDirectory?.name || currentTodoItem?.description || "");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isDirectory) {
      if (isEdit) {
        dispatch(
          updateDirectory({
            name: description,
            parentId: directory.id || null,
            id: editableDirectory?.id!,
          }) as ActionFromReducer<IUpdateDirectory>
        );
        handleClose();
        return;
      }
      dispatch(
        createDirectoryByUser({
          name: description,
          parentId: directory.id || null,
        }) as ActionFromReducer<ICreateDirectory>
      );
      handleClose();
      return;
    }

    if (isEdit) {
      dispatch(
        updateTodoItemById({
          id: currentTodoItem?.id!,
          todoItem: {
            ...currentTodoItem,
            description: description,
          },
        }) as ActionFromReducer<IUpdateDirectory>
      );
      handleClose();
      return;
    }

    dispatch(
      createTodoItemByUser({
        description: description,
        selected: false,
        directoryId: (directory?.id as number) || null,
        notification: currentTodoItem?.notification,
      }) as ActionFromReducer<ICreateTodoItem>
    );

    handleClose();
  };

  const handleChange = (e: SyntheticEvent<any>) => {
    const { value } = e.currentTarget;
    setDescription(value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  return (
    <StyledWrapperSectionAddItem>
      <StyledH3>{isEdit ? "Edit" : `Add`} {isDirectory ? "Directory" : "Task"}</StyledH3>
      <AddItemForm onSubmit={handleSubmit}>
        <StyledLabel htmlFor="description">Description</StyledLabel>
        <StyledDescriptionInput
          name="description"
          value={description}
          rows={5}
          onChange={handleChange}
        />
        {(type === "task" || !!currentTodoItem) && (
            <EditableNotificationSection />
        )}
        <StyledFlextContainer>
          <StyledAddButton type="submit">{isEdit ? "Edit" : "Add"}</StyledAddButton>
        </StyledFlextContainer>
        {error && <StyledErrorParagraph>{error}</StyledErrorParagraph>}
      </AddItemForm>
    </StyledWrapperSectionAddItem>
  );
};

export default AddItemModal;

const StyledDescriptionInput = styled.textarea`
  resize: none;
  border: none;
  padding: 5px;
  outline: none;
  border-bottom: 1px solid #ccc;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  &:focus {
    border-color: #3d53c5;
  }
`;

const StyledLabel = styled.label`
  margin-top: 10px;
  font-size: 1rem;
`;

const AddItemForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledSelect = styled.select`
  border: none;
  border-bottom: 1px solid #000000;
  padding: 3px;
  outline: none;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
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
