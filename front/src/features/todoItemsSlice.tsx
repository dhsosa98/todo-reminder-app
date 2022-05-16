import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITodoItem } from "../interfaces/TodoItem/ITodoItem";
import handleErrors from "../utilities/errors";
import { todoItemService } from "../services/TodoItem";
import { RootState } from "../app/store";
import { deleteAlert, successAlert } from "../utilities/sweetalert";
import { ICreateTodoItem } from "../interfaces/TodoItem/ICreateTodoItem";
import { directoryService } from "../services/directories";
import { IDirectory } from "../interfaces/Directory/IDirectory";

export const getTodoItemsByUser = createAsyncThunk<ITodoItem[], number>(
  "todoItems/getTodoItems",
  async (directoryId, { dispatch, getState }) => {
    try {
      dispatch(setIsLoading(true));
      const directoryResponse = await directoryService.getDirectory(
        directoryId
      );
      const {search} = (getState() as RootState).todoitems;
      dispatch(setDirectory(directoryResponse.data));
      const { data } = await directoryService.getTodoItemsByDirectoryId(
        directoryId, search
      );
      return data;
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
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
      dispatch(getTodoItemsByUser(id));
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
      const { id: directoryId } = (getState() as RootState).todoitems.directory;
      dispatch(getTodoItemsByUser(directoryId));
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
      const { id: directoryId } = (getState() as RootState).todoitems.directory;
      await dispatch(getTodoItemsByUser(directoryId));
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
      const { todoList } = (getState() as RootState).todoitems;
      await todoItemService.updateTodoItem(todoItem.id, todoItem);
      dispatch(
        setTodoItems(
          todoList?.map((item) => (item.id === todoItem.id ? todoItem : item)) || todoList
        )
      );
    } catch (err) {
      handleErrors(err, dispatch, setError);
    }
  }
);

export const update = createAsyncThunk<void, IUpdateTodoItem>(
  "todoItems/updateTodoItem",
  async ({ id, todoItem }, { dispatch, getState }) => {
    try {
      dispatch(setIsLoading(true));
      await todoItemService.updateTodoItem(id, todoItem);
      await successAlert("The TodoItem has been Updated Successfully");
      const { id: directoryId } = (getState() as RootState).todoitems.directory;
      await dispatch(getTodoItemsByUser(directoryId));
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

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

const todoItemsSlice = createSlice({
  name: "todoItems",
  initialState: {
    todoList: [] as ITodoItem[],
    todoItem: {id: 0, selected: false, description: ''} as ITodoItem,
    isLoading: false,
    directory: {
      id: 0,
      name: "",
    } as IDirectory,
    error: "",
    search: "",
  },
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
      state.todoItem = action.payload;
    },
    setDirectory: (state, action: PayloadAction<IDirectory>) => {
      state.directory = action.payload;
    },
    setTodoItems: (state, action: PayloadAction<ITodoItem[]>) => {
      state.todoList = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      getTodoItemsByUser.fulfilled,
      (state, action: PayloadAction<ITodoItem[]>) => {
        state.todoList = action.payload;
      }
    );
    builder.addCase(
      getTodoItemById.fulfilled,
      (state, action: PayloadAction<ITodoItem>) => {
        state.todoItem = action.payload;
      }
    );
  },
});

export const {
  setIsLoading,
  setError,
  resetError,
  setTodoItem,
  setDirectory,
  setTodoItems,
  setSearch
} = todoItemsSlice.actions;

export const selectTodoItems = (state: RootState) => state.todoitems;

export default todoItemsSlice.reducer;
