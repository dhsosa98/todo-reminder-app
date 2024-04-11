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
import { IUpdateDirectory } from "../interfaces/Directory/IUpdateDirectory";

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

export const updateDirectory = createAsyncThunk<void, Partial<IDirectory>>(
  "directories/updateDirectory",
  async (directory, { dispatch }) => {
    try {
      dispatch(setIsLoading(true));
      await directoryService.updateDirectory(directory.id!, directory);
      await successAlert("The Directory has been Updated Successfully");
      await dispatch(getDirectoryByUser());
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
      await dispatch(getDirectoryByUser());
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
      await dispatch(getDirectoryByUser());
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const getDirectoryByUser = createAsyncThunk<IDirectory, number|undefined|null>(
  "directories/getDirectory",
  async (id, { dispatch, getState }) => {
    try {
      const currentDirectoryId = (getState() as RootState).directory?.currentDirectory?.id as number;
      id = id===undefined ? currentDirectoryId : id;
      dispatch(setIsLoading(true));
      if (id === null || id === undefined) {
        const { data } = await directoryService.getBaseDirectories();
        return data;
      }
      const { data } = await directoryService.getDirectory(id || null);
      return data;
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const initialDirectoryState: {
  directories: IDirectory[];
  currentDirectory: IDirectory;
  editableDirectory: IDirectory | null;
  isLoading: boolean;
  error: string;
  isOpenedModal: boolean;
  isDragging: boolean;
  toDirectoryId: number | null | undefined;
  directoriesEl: HTMLElement|null;
} = {
  directories: [],
  isOpenedModal: false,
  editableDirectory: null,
  currentDirectory: {
    id: undefined,
    name: "",
    children: [],
    todoItem: [],
  },
  isDragging: false,
  toDirectoryId: undefined,
  isLoading: false,
  error: "",
  directoriesEl: null,
};

const directorySlice = createSlice({
  name: "directory",
  initialState: initialDirectoryState,
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
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    resetError: (state) => {
      state.error = "";
    },
    updateTodoItem: (state, action: PayloadAction<ITodoItem>) => {
      const directoryId = action.payload.directoryId;
      if (directoryId !== state.currentDirectory.id) {
        state.currentDirectory.todoItem = state.currentDirectory.todoItem?.filter(
          (item) => item.id !== action.payload.id
        );
        return;
      }
      state.currentDirectory.todoItem = state.currentDirectory.todoItem?.map(
        (item) => (item.id === action.payload.id ? action.payload : item)
      );
    },
    setEditableDirectory: (state, action: PayloadAction<IDirectory|null>) => {
      state.editableDirectory = action.payload;
    },
    updateTodoItems: (state, action: PayloadAction<ITodoItem[]>) => {
      state.currentDirectory.todoItem = action.payload;
    },
    setIsOpenedModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenedModal = action.payload;
    },
    setToDirectoryId: (state, action: PayloadAction<number | null| undefined>) => {
      state.toDirectoryId = action.payload;
    },
    setDirectoriesEl: (state, action: PayloadAction<any>) => {
      state.directoriesEl = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      getDirectoriesByUser.fulfilled,
      (state, action: PayloadAction<IDirectory[]>) => {
        state.directories = action.payload;
      },
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

export const { setIsLoading, setError, resetError, setToDirectoryId, setCurrentDirectory, updateTodoItem, updateTodoItems, setIsDragging, setIsOpenedModal, setEditableDirectory, setDirectoriesEl } = directorySlice.actions;

export default directorySlice.reducer;
