import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITodoItem } from "../interfaces/TodoItem/ITodoItem";
import handleErrors from "../utilities/errors";
import { todoItemService } from "../services/TodoItem";
import { RootState } from "../app/store";
import { deleteAlert, successAlert } from "../utilities/sweetalert";
import { ICreateTodoItem } from "../interfaces/TodoItem/ICreateTodoItem";
import { directoryService } from "../services/directories";
import { IDirectory } from "../interfaces/Directory/IDirectory";
import { getDirectoryByUser, updateTodoItem, updateTodoItems } from "./directorySlice";
import TodoItem from "../components/TodoItem";
import { AxiosError } from "axios";
import handleHttpErrors from "../utilities/http/handleErrors";

export const updateTodoItemOrder = createAsyncThunk<void, ITodoItem[], {state: RootState}>(
  "todoItems/updateTodoItemOrder",
  async (todoItems, { dispatch, getState }) => {
    try {
      const storedTodoItems = getState().directory?.currentDirectory?.todoItem ?? [];
      const processedTodoItems = storedTodoItems.map((todoItem) => {
        const todoItemOrdered = todoItems.find((item) => item.id === todoItem.id);
        return todoItemOrdered || todoItem;
      });
      await todoItemService.updateTodoItemOrder(processedTodoItems);
      dispatch(updateTodoItems(processedTodoItems));
    } catch (err: any) {
      handleHttpErrors(err);
    }
  }
);

export const createTodoItemByUser = createAsyncThunk<void, ICreateTodoItem>(
  "todoItems/createTodoItem",
  async (todoItem) => {
    try{
      await todoItemService.createTodoItem(todoItem);
    } catch (err: any) {
      handleHttpErrors(err);
    }
  }
);

export const deleteTodoItemById = createAsyncThunk<void, number>(
  "todoItems/deleteTodoItem",
  async (id) => {
    try {
      await todoItemService.deleteTodoItem(id);
    }
    catch (err: any) {
      handleHttpErrors(err);
    }
  }
);

export const updateTodoItemById = createAsyncThunk<void, Partial<ITodoItem>>(
  "todoItems/updateTodoItem",
  async (todoItem) => {
    try {
      await todoItemService.updateTodoItem(todoItem.id!, todoItem);
    }
    catch (err: any) {
      handleHttpErrors(err);
    }
  }
);

export const updateSelected = createAsyncThunk<void, ITodoItem>(
  "todoItems/updateSelected",
  async (todoItem, { dispatch }) => {
    try {
      dispatch(updateTodoItem(todoItem));
      const {notification, ...task} = todoItem
      await todoItemService.updateTodoItem(todoItem.id, task);
    } 
    catch (err: any) {
      handleHttpErrors(err);
    }
  }
);

export const getTodoItemById = createAsyncThunk<ITodoItem, number>(
  "todoItems/getTodoItem",
  async (id) => {
    try {
      const { data } = await todoItemService.getTodoItem(id);
      return data;
    }
    catch (err: any) {
      handleHttpErrors(err);
    }
  }
);

export const initiaTaskslState = {
  currentTodoItem: null as unknown as ITodoItem,
  status: "idle" as 'idle' | 'loading' | 'succeeded' | 'failed' | "submiteed",
  error: null as Error | AxiosError | null,
};

export const todoItemsSlice = createSlice({
  name: "todoItems",
  initialState: initiaTaskslState,
  reducers: {
    setError: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    setTodoItem: (state, action: PayloadAction<ITodoItem>) => {
      state.currentTodoItem = action.payload;
    },
    setNotification: (state, action: PayloadAction<any>) => {
      if (!state.currentTodoItem) {
        state.currentTodoItem = {} as ITodoItem;
      }
      state.currentTodoItem.notification = action.payload.notification;
    },
    reset: (state) => {
      state.currentTodoItem = null as unknown as ITodoItem;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getTodoItemById.pending,
      (state, action) => {
        state.status = "loading";
      }
    ),
    builder.addCase(
      getTodoItemById.fulfilled,
      (state, action: PayloadAction<ITodoItem>) => {
        state.status = "succeeded";
        state.currentTodoItem = action.payload;
      }
    ),
    builder.addCase(
      getTodoItemById.rejected,
      (state, action) => {
        state.status = "failed";
        state.error = action.error as Error;
      }
    ),
    builder.addCase(
      updateTodoItemById.pending,
      (state, action) => {
        state.currentTodoItem = action.meta.arg as ITodoItem;
        state.status = "loading";
      }
    ),
    builder.addCase(
      updateTodoItemById.fulfilled,
      (state, action) => {
        state.status = "submiteed";
      }
    ),
    builder.addCase(
      updateTodoItemById.rejected,
      (state, action) => {
        console.log({action});
        state.status = "failed";
        state.error = action.error as Error;
      }
    ),
    builder.addCase(
      createTodoItemByUser.rejected,
      (state, action) => {
        state.error = action.error as Error;
        state.status = "failed";
      }
    ),
    builder.addCase(
      createTodoItemByUser.pending,
      (state, action) => {
        state.status = "loading";
      }
    ),
    builder.addCase(
      createTodoItemByUser.fulfilled,
      (state, action) => {
        state.status = "submiteed";
      }
    ),
    builder.addCase(
      deleteTodoItemById.rejected,
      (state, action) => {
        state.error = action.error as Error;
        state.status = "failed";
      }
    ),
    builder.addCase(
      deleteTodoItemById.pending,
      (state, action) => {
        state.status = "loading";
      }
    ),
    builder.addCase(
      deleteTodoItemById.fulfilled,
      (state, action) => {
        state.status = "succeeded";
      }
    )
  }
});


export const {
  setError,
  resetError,
  setTodoItem,
  setSearch,
  setNotification,
  reset,
} = todoItemsSlice.actions;

export const selectTodoItems = (state: RootState) => state.todoitems;

export default todoItemsSlice.reducer;
