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
    try {
      if (todoItem.description.length < 3) {
        dispatch(
          setError(
            "Please enter a TodoItem Description of at least 3 characters"
          )
        );
        return;
      }
      const { id } = (getState() as RootState).todoitems.directory;
      dispatch(setIsLoading(true));
      await todoItemService.createTodoItem(todoItem);
      await successAlert("The TodoItem has been Created Successfully");
      await dispatch(getDirectoryByUser(id));
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const deleteTodoItemById = createAsyncThunk<void, number>(
  "todoItems/deleteTodoItem",
  async (id, { dispatch, getState }) => {
    try {
      await deleteAlert(
        "Are you sure you want to delete this TodoItem?",
        "The TodoItem has been deleted Successfully"
      );
      dispatch(setIsLoading(true));
      await todoItemService.deleteTodoItem(id);
      const { id: directoryId } = (getState() as RootState).directory.currentDirectory;
      await dispatch(getDirectoryByUser(directoryId));
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

interface IUpdateTodoItem {
  id: number;
  todoItem: ITodoItem;
}

export const updateTodoItemById = createAsyncThunk<void, IUpdateTodoItem>(
  "todoItems/updateTodoItem",
  async ({ id, todoItem }, { dispatch, getState }) => {
    try {
      dispatch(setIsLoading(true));
      await todoItemService.updateTodoItem(id, todoItem);
      await successAlert("The TodoItem has been Updated Successfully");
      const { id: directoryId } = (getState() as RootState).directory.currentDirectory;
      await dispatch(getDirectoryByUser(directoryId));
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
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
      // await dispatch(getDirectoryByUser(directoryId));
    } catch (err) {
      handleErrors(err, dispatch, setError);
    }
  }
);

// export const update = createAsyncThunk<void, IUpdateTodoItem>(
//   "todoItems/updateTodoItem",
//   async ({ id, todoItem }, { dispatch, getState }) => {
//     try {
//       dispatch(setIsLoading(true));
//       await todoItemService.updateTodoItem(id, todoItem);
//       await successAlert("The TodoItem has been Updated Successfully");
//       const { id: directoryId } = (getState() as RootState).todoitems.directory;
//       await dispatch(getTodoItemsByUser(directoryId));
//     } catch (err) {
//       handleErrors(err, dispatch, setError);
//     } finally {
//       dispatch(setIsLoading(false));
//     }
//   }
// );

export const getTodoItemById = createAsyncThunk<ITodoItem, number>(
  "todoItems/getTodoItem",
  async (id, { dispatch }) => {
    try {
      dispatch(setIsLoading(true));
      const { data } = await todoItemService.getTodoItem(id);
      return data;
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const initiaTaskslState = {
  todoList: [] as ITodoItem[],
  currentTodoItem: null as unknown as ITodoItem,
  isLoading: false,
  directory: {
    id: 0,
    name: "",
    children: [],
    todoItem: [],
  } as IDirectory,
  error: "",
  search: "",
};

const todoItemsSlice = createSlice({
  name: "todoItems",
  initialState: initiaTaskslState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
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
      getTodoItemById.fulfilled,
      (state, action: PayloadAction<ITodoItem>) => {
        state.currentTodoItem = action.payload;
      }
    )
  },
});

export const {
  setIsLoading,
  setError,
  resetError,
  setTodoItem,
  setSearch,
  setNotification,
} = todoItemsSlice.actions;

export const selectTodoItems = (state: RootState) => state.todoitems;

export default todoItemsSlice.reducer;
