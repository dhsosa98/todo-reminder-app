import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { ICreateDirectory } from "../interfaces/Directory/ICreateDirectory";
import { IDirectory } from "../interfaces/Directory/IDirectory";
import {directoryService} from "../services/directories";
import handleErrors from "../utilities/errors";
import { deleteAlert, successAlert } from "../utilities/sweetalert";
import { ITodoItem } from "../interfaces/TodoItem/ITodoItem";

export const getDirectoriesByUser = createAsyncThunk<IDirectory[]>(
  "directories/getDirectories",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setIsLoading(true));
      const { data } = await directoryService.getDirectories();
      return data;
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const createDirectoryByUser = createAsyncThunk<void, ICreateDirectory>(
  "directories/createDirectory",
  async (directory, { dispatch }) => {
    try {
      if (directory.name.length < 3) {
        dispatch(
          setError("Please enter a Directory name of at least 3 characters")
        );
        return;
      }
      dispatch(setIsLoading(true));
      await directoryService.createDirectory(directory);
      await successAlert("The Directory has been Created Successfully");
      dispatch(getDirectoriesByUser());
      dispatch(getDirectoryByUser())
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const deleteDirectoryById = createAsyncThunk<void, number>(
  "directories/deleteDirectory",
  async (id, { dispatch }) => {
    try {
      await deleteAlert(
        "Are you sure you want to delete this Directory?",
        "The Directory has been deleted Successfully"
      );
      dispatch(setIsLoading(true));
      await directoryService.deleteDirectory(id);
      dispatch(getDirectoriesByUser());
      dispatch(getDirectoryByUser())
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const getDirectoryByUser = createAsyncThunk<IDirectory, number|undefined>(
  "directories/getDirectory",
  async (id, { dispatch, getState }) => {
    try {
      const currentDirectoryId = (getState() as RootState).directory?.currentDirectory?.id as number;
      dispatch(setIsLoading(true));
      const { data } = await directoryService.getDirectory(id || currentDirectoryId);
      return data;
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

const initialState: {
  directories: IDirectory[];
  currentDirectory: IDirectory;
  isLoading: boolean;
  error: string;
} = {
  directories: [],
  currentDirectory: {
    name: "",
    children: [],
    todoItem: [],
  },
  isLoading: false,
  error: "",
};

const directorySlice = createSlice({
  name: "directory",
  initialState: initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentDirectory: (state, action: PayloadAction<IDirectory>) => {
      state.currentDirectory = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = "";
    },
    updateTodoItem: (state, action: PayloadAction<ITodoItem>) => {
      state.currentDirectory.todoItem = state.currentDirectory.todoItem?.map(
        (item) => (item.id === action.payload.id ? action.payload : item)
      );
    },
    updateTodoItems: (state, action: PayloadAction<ITodoItem[]>) => {
      state.currentDirectory.todoItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getDirectoriesByUser.fulfilled,
      (state, action: PayloadAction<IDirectory[]>) => {
        state.directories = action.payload;
      }
    );
    builder.addCase(
      getDirectoryByUser.fulfilled,
      (state, action: PayloadAction<IDirectory>) => {
        state.currentDirectory = action.payload;
      }
    );
  },
});

export const selectDirectory = (state: RootState) => state.directory;

export const { setIsLoading, setError, resetError, setCurrentDirectory, updateTodoItem, updateTodoItems } = directorySlice.actions;

export default directorySlice.reducer;
