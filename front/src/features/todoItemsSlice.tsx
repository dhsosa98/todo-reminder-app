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

export const updateTodoItemOrder = createAsyncThunk<void, ITodoItem[]>(
  "todoItems/updateTodoItemOrder",
  async (todoItems, { dispatch, getState }) => {
    try {
      const storedTodoItems = (getState() as RootState).directory?.currentDirectory?.todoItem ?? [];
      const processedTodoItems = storedTodoItems.map((todoItem) => {
        const todoItemOrdered = todoItems.find((item) => item.id === todoItem.id);
        return todoItemOrdered || todoItem;
      });
      await todoItemService.updateTodoItemOrder(processedTodoItems);
      dispatch(updateTodoItems(processedTodoItems));
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
    }
  }
);

export const createTodoItemByUser = createAsyncThunk<void, ICreateTodoItem>(
  "todoItems/createTodoItem",
  async (todoItem, { dispatch, getState }) => {
    await todoItemService.createTodoItem(todoItem);
    await successAlert("The TodoItem has been Created Successfully");
    await dispatch(getDirectoryByUser());
  }
);

export const deleteTodoItemById = createAsyncThunk<void, number>(
  "todoItems/deleteTodoItem",
  async (id, { dispatch, getState }) => {
      await todoItemService.deleteTodoItem(id);
      await dispatch(getDirectoryByUser());
  }
);

export const updateTodoItemById = createAsyncThunk<void, Partial<ITodoItem>>(
  "todoItems/updateTodoItem",
  async (todoItem, { dispatch, getState }) => {
      await todoItemService.updateTodoItem(todoItem.id!, todoItem);
      await successAlert("The TodoItem has been Updated Successfully");
      await dispatch(getDirectoryByUser());
  }
);

export const updateSelected = createAsyncThunk<void, ITodoItem>(
  "todoItems/updateSelected",
  async (todoItem, { dispatch, getState }) => {
    try {
      dispatch(updateTodoItem(todoItem));
      const {notification, ...task} = todoItem
      await todoItemService.updateTodoItem(todoItem.id, task);
      const { id: directoryId } = (getState() as RootState).directory.currentDirectory;
    } catch (err) {
      handleErrors(err, dispatch, setError);
    }
  }
);

export const getTodoItemById = createAsyncThunk<ITodoItem, number>(
  "todoItems/getTodoItem",
  async (id, { dispatch }) => {
    try {
      const { data } = await todoItemService.getTodoItem(id);
      return data;
  }
);

export const initiaTaskslState = {
  todoList: [] as ITodoItem[],
  currentTodoItem: null as unknown as ITodoItem,
  status: "idle" as 'idle' | 'loading' | 'succeeded' | 'failed',
  error: "",
  search: "",
};

const todoItemsSlice = createSlice({
  name: "todoItems",
  initialState: initiaTaskslState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = "";
    },
    setTodoItem: (state, action: PayloadAction<ITodoItem>) => {
      state.currentTodoItem = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setNotification: (state, action: PayloadAction<any>) => {
      if (!state.currentTodoItem) {
        state.currentTodoItem = {} as ITodoItem;
      }
      state.currentTodoItem.notification = action.payload.notification;
    }
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
        state.error = action.error.message || "";
      }
    ),
    builder.addCase(
      updateTodoItemById.pending,
      (state, action) => {
        state.status = "loading";
      }
    ),
    builder.addCase(
      updateTodoItemById.fulfilled,
      (state, action) => {
        state.status = "succeeded";
      }
    ),
    builder.addCase(
      updateTodoItemById.rejected,
      (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "";
      }
    ),
    builder.addCase(
      createTodoItemByUser.rejected,
      (state, action) => {
        state.error = action.error.message || "";
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
        state.status = "succeeded";
      }
    ),
    builder.addCase(
      deleteTodoItemById.rejected,
      (state, action) => {
        state.error = action.error.message || "";
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
} = todoItemsSlice.actions;

export const selectTodoItems = (state: RootState) => state.todoitems;

export default todoItemsSlice.reducer;
