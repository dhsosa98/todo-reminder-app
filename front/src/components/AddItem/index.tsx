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
  reset as resetTodoItems,
  selectTodoItems,
  setTodoItem,
  updateTodoItemById,
} from "../../features/todoItemsSlice";
import { useDispatch } from "react-redux";
import directorySlice, {
  createDirectoryByUser,
  getDirectoryByUser,
  initialDirectoryState,
  reset as resetDirectory,
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
import { successAlert } from "../../utilities/sweetalert";
import handleErrors from "../../utilities/errors";

type AddItemProps = {
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleChange: (e: SyntheticEvent<any>) => void;
    type: "task" | "directory";
    isEdit: boolean;
    values: any;
    error: any;
    status: string;
    onSended: () => void;
};

const StyledWrapperSectionAddItem = styled(StyledWrapperSection)`
  display: flex;
`;

const AddItemModal = ({}) => {

    const dispatch = useDispatch();

    const { error: errorTask, currentTodoItem, status: statusTask } = useSelector(selectTodoItems);

    const { currentDirectory, editableDirectory, status: statusDirectory, error: errorDirectory, isOpenedModal: isOpen } = useSelector(selectDirectory);

    const isDirectory = editableDirectory?.id || editableDirectory?.id;

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
    }

    useEffect(() => {
        if (isDirectory) {
          setDescription(editableDirectory?.name || "");
        } else {
          setDescription(currentTodoItem?.description || "");
        }
    }
    , [editableDirectory?.name, currentTodoItem?.description]);

    const [description, setDescription] = useState<string>(
        currentTodoItem?.description || editableDirectory?.name || ""
    );

    const handleSubmitTask = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isEdit) {
        dispatch(
          updateTodoItemById({
            ...currentTodoItem,
            description: description,
            notification: currentTodoItem?.notification,
          }) as ActionFromReducer<Partial<ITodoItem>>
        );
        return;
      }
  
      dispatch(
        createTodoItemByUser({
          description: description,
          selected: false,
          directoryId: (editableDirectory?.id as number) || null,
          notification: currentTodoItem?.notification,
        }) as ActionFromReducer<ICreateTodoItem>
      );
    }


    const handleSubmitDirectory = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
        if (isEdit) {
          dispatch(
            updateDirectory({
              name: description,
              parentId: editableDirectory?.parentId || null,
              id: editableDirectory?.id!,
            }) as ActionFromReducer<IUpdateDirectory>
          );
          return;
        }
        dispatch(
          createDirectoryByUser({
            name: description,
            parentId: currentDirectory?.id || null,
          }) as ActionFromReducer<ICreateDirectory>
        );
        return;
    };  

    const handleChange = (e: SyntheticEvent<any>) => {
        const { name, value } = e.currentTarget;
        setDescription(value);
    }

    const isEdit = (editableDirectory?.id || currentTodoItem?.id) ? true : false;

    const type = isDirectory ? "directory" : "task";

    const onSendedDirectory = () => {
        dispatch(resetDirectory());
        isEdit ? successAlert("The Directory has been Updated Successfully") :
        successAlert("The Directory has been Created Successfully") 
        dispatch(getDirectoryByUser() as ActionFromReducer<IDirectory>);
        handleClose();
    }

    const onSendedTask = () => {
        dispatch(resetTodoItems());
        isEdit ? successAlert("The Task has been Updated Successfully") :
        successAlert("The Task has been Created Successfully")
        dispatch(getDirectoryByUser() as ActionFromReducer<IDirectory>);
        handleClose();
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
            <AddItem 
            type={type} 
            handleSubmit={type === "task" ? handleSubmitTask : handleSubmitDirectory}
            handleChange={handleChange}
            isEdit={isEdit}
            values={{
              description: description,
            }}
            error={type === "task" ? errorTask : errorDirectory}
            status={type === "task" ? statusTask : statusDirectory}
            onSended={type === "task" ? onSendedTask : onSendedDirectory}
            />
          </div>
        </div>
      )}
    </>
  );
};

const AddItem: FC<AddItemProps> = ({handleSubmit, handleChange, type, isEdit, values, error, status, onSended}) => {

  useEffect(() => {
    if (status === "submiteed") {
      onSended()
    }
  }, [status]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <StyledWrapperSectionAddItem>
      <StyledH3>{isEdit ? "Edit" : `Add`} {type==="directory" ? "Directory" : "Task"}</StyledH3>
      <AddItemForm onSubmit={handleSubmit}>
        <StyledLabel htmlFor="description">{type==="directory" ? "Name" : "Description"}</StyledLabel>
        <StyledDescriptionInput
          name="description"
          value={values.description}
          rows={5}
          onChange={handleChange}
        />
        {type === "task" && <EditableNotificationSection />}
        <StyledFlextContainer>
          <StyledAddButton type="submit">{isEdit ? "Edit" : "Add"}</StyledAddButton>
        </StyledFlextContainer>
        {error && <StyledErrorParagraph>{error.message}</StyledErrorParagraph>}
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
