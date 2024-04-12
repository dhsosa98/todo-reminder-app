import { FC, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITodoItem } from "../../interfaces/TodoItem/ITodoItem";
import { todoItemService } from "../../services/TodoItem";
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
import NotFound from "../NotFound";
import { useDispatch } from "react-redux";
import {
  getTodoItemById,
  selectTodoItems,
  setNotification,
  setTodoItem,
  updateTodoItemById,
} from "../../features/todoItemsSlice";
import { ActionFromReducer } from "redux";
import { useSelector } from "react-redux";
import { resetError } from "../../features/todoItemsSlice";
import useTodoItem from "../../hooks/useTodoItem";

const EditTodoItem: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentTodoItem: todoItem, error, isLoading } = useTodoItem(Number(id));

  const handleChange = (e: SyntheticEvent<any>) => {
    const { name, type } = e.currentTarget;

    const isNotification = name.includes("notification");

    if (isNotification) {
      const { notification } = todoItem as ITodoItem;
      const [key, subKey] = name.split(".");

      dispatch(
        setNotification({
          notification: {
            ...notification,
            [subKey]: e.currentTarget.value,
          },
        })
      );
      return;
    }

    dispatch(
      setTodoItem({
        ...todoItem,
        [name]: e.currentTarget.value,
      })
    );

    dispatch(resetError());
  };

  const handleChangeProviders = (e: SyntheticEvent<any>) => {
    const { name } = e.currentTarget;
    const { notification } = todoItem as ITodoItem;
    const providers = notification?.providers || [];
    const newProviders = providers.includes(name)
      ? providers.filter((provider) => provider !== name)
      : [...providers, name];
    dispatch(
      setNotification({
        notification: {
          ...notification,
          providers: newProviders,
        },
      })
    );
  }


  const handleUpdate = async () => {
    dispatch(
      updateTodoItemById({
        ...todoItem,
        id: Number(id),
      }) as ActionFromReducer<Partial<ITodoItem>>
    );
    dispatch(resetError());
    // handleNavigate();
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  const isSelected = (provider: string) => {
    return todoItem?.notification?.providers?.includes(provider) || false;
  }

  const onChecked = (e: SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    dispatch(
      setNotification({
        notification: {
          ...todoItem.notification,
          active: checked,
        },
      })
    );
  }

  const handleResetProvider = () => {
    dispatch(
      setNotification({
        notification: {
          ...todoItem.notification,
          providers: [],
        },
      })
    );
  }

  if (error === "Not Found") {
    return (
      <StyledContainer>
        <StyledH1>Not Found</StyledH1>
        <NotFound title="To-do item with that ID">
          <StyledBackButton onClick={handleNavigate}>Back</StyledBackButton>
        </NotFound>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <StyledCard>
            <h1>Editing Task {todoItem?.id}</h1>
            <TaskSection id="task-section">
              <StyledNotificationText>Task</StyledNotificationText>
              <label htmlFor="description">Description</label>
              <StyledDescriptionInput
                name="description"
                value={todoItem?.description || ""}
                disabled={isLoading}
                rows={5}
                onChange={handleChange}
              />
            </TaskSection>
            <NotificationSection>
              <StyledNotificationText>Notification</StyledNotificationText>
              <div>
              <label htmlFor="notification.active">Active</label>
              <input
                type="checkbox"
                checked={todoItem?.notification?.active || false}
                onChange={onChecked}
              />
              </div>
              {todoItem?.notification?.active && 
              <>
              <label htmlFor="notification.provider">Provider
              <StyledResetButton onClick={handleResetProvider}>reset</StyledResetButton>
              </label>
              <ProvidersSection>
                <ProviderButton name="firebase" onClick={handleChangeProviders} selected={isSelected("firebase")}>Firebase</ProviderButton>
                <TelegramButton name="telegram" onClick={handleChangeProviders} selected={isSelected("telegram")}>Telegram</TelegramButton>
              </ProvidersSection>
              <label htmlFor="notification.schedule">Schedule on:</label>
              <StyledDescriptionInput
                name="notification.schedule"
                value={todoItem?.notification?.schedule || ""}
                onChange={handleChange}
                disabled={isLoading}
              />
              <p style={{ fontSize: "0.6rem", whiteSpace: "pre-wrap" }}>
                Ex: "every 5 minutes", "every 1 hours", "every 1 days at 13:57", "every 1 weeks at 13:57 on Mon", "every 1 months at 13:57 on each 23 day, every 1 months at 00:01 on the first Mon"
              </p>
              </>}
            </NotificationSection>
            <StyledWrapper>
                <StyledBackButton onClick={handleNavigate}>Back</StyledBackButton>
                <StyledAddButton onClick={handleUpdate}>Save</StyledAddButton>
              </StyledWrapper>
          </StyledCard>
          {error && <StyledErrorParagraph>{error}</StyledErrorParagraph>}
        </>
      )}
    </StyledContainer>
  );
};

// export default EditTodoItem;

const EditableNotificationSection = () => {

  const {currentTodoItem: todoItem} = useSelector(selectTodoItems);

  const handleChange = (e: SyntheticEvent<any>) => {
    dispatch(
      setNotification({
        notification: {
          ...todoItem?.notification,
          [e.currentTarget.name]: e.currentTarget.value,
        },
      })
    );
  }

  const dispatch = useDispatch();

  const isSelected = (provider: string) => {
    return todoItem?.notification?.providers?.includes(provider) || false;
  }

  const onChecked = (e: SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    dispatch(
      setNotification({
        notification: {
          ...todoItem?.notification,
          active: checked,
        },
      })
    );
  }

  const handleChangeProviders = (e: SyntheticEvent<any>) => {
    const { name } = e.currentTarget;
    const { notification } = todoItem as ITodoItem;
    const providers = notification?.providers || [];
    const newProviders = providers.includes(name)
      ? providers.filter((provider) => provider !== name)
      : [...providers, name];
    dispatch(
      setNotification({
        notification: {
          ...notification,
          providers: newProviders,
        },
      })
    );
  }
  return (
    <NotificationSection>
    <StyledNotificationText>Notification</StyledNotificationText>
    <div>
    <label htmlFor="active">Active</label>
    <input
      name="active"
      type="checkbox"
      checked={todoItem?.notification?.active || false}
      onChange={onChecked}
    />
    </div>
    {todoItem?.notification?.active && 
    <>
      <label htmlFor="provider">Provider
      {/* <StyledResetButton onClick={handleResetProvider}>reset</StyledResetButton> */}
      </label>
      <ProvidersSection>
        <ProviderButton type="button" name="firebase" onClick={handleChangeProviders} selected={isSelected("firebase")}>Firebase</ProviderButton>
        <TelegramButton type="button" name="telegram" onClick={handleChangeProviders} selected={isSelected("telegram")}>Telegram</TelegramButton>
      </ProvidersSection>
      <label htmlFor="notification.schedule">Schedule on:</label>
      <StyledDescriptionInput
        name="schedule"
        value={todoItem?.notification?.schedule || ""}
        onChange={handleChange}
      />
      <p style={{ fontSize: "0.6rem", whiteSpace: "pre-wrap" }}>
        Ex: "every 5 minutes", "every 1 hours", "every 1 days at 13:57", "every 1 weeks at 13:57 on Mon", "every 1 months at 13:57 on each 23 day, every 1 months at 00:01 on the first Mon"
      </p>
    </>}
  </NotificationSection>
  )
}

export default EditableNotificationSection;

const ProvidersSection = styled.div`
  display: flex;
  gap: 10px;
`;

const StyledResetButton = styled.span`
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledInputCheckbox = styled.input`
  margin-right: 5px;
`;

const StyledNotificationText = styled.h3`
  margin: 0;
  padding: 0;
`;

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

const NotificationSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const TaskSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const ProviderButton = styled.button<{selected: boolean}>`
  color: ${(props: any) => (props.selected ? "#ffffff" : "#f2b017")};
  border: ${(props: any) => (props.selected ? "1px solid #c58f12" : "1px solid #f2b017")};
  background-color: ${(props: any) => (props.selected ? "#f2b017" : "transparent")};
  padding: 10px;
  border-radius: 5px;
  width: 100px;
  opacity: ${(props: any) => (props.selected ? 0.5 : 1)};
  cursor: pointer;
  &:hover {
    background-color: #f2b017;
    color: white;
  };
`;

const TelegramButton = styled(ProviderButton)`
  color: ${(props: any) => (props.selected ? "#ffffff" : "#a917f2")};
  border: ${(props: any) => (props.selected ? "1px solid #7d3dc5" : "1px solid #a917f2")};
  background-color: ${(props: any) => (props.selected ? "#a917f2" : "transparent")};
  padding: 10px;
  border-radius: 5px;
  &:hover {
    background-color: #a917f2;
    color: white;
  };
`;

//   color: ${(props: any) => (props.selected ? "white" : "#f2b017")};
//   border: ${(props: any) => (props.selected ? "none" : "1px solid #f2b017")};
//   background-color: transparent;
//   padding: 10px;
//   border-radius: 5px;
//   &:hover {
//     background-color: #f2b017;
//     color: white;
//   };
// `;

const StyledWrapper = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  width: 100%;
`;

const StyledCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  background-color: white;
  margin: 10px;
  max-width: 400px;
  animation: myAnim 0.4s ease-in 0s 1 normal forwards;
  @keyframes myAnim {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  font-size: 0.8rem;
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;
