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
import { deleteAlert, errorAlert, successAlert } from "../utilities/sweetalert";
import { ITodoItem } from "../interfaces/TodoItem/ITodoItem";
import { AxiosError } from "axios";
import handleHttpErrors from "../utilities/http/handleErrors";

export const getDirectoriesByUser = createAsyncThunk<IDirectory[]>(
  "directories/getDirectories",
  async (_) => {
    try {
      const { data } = await directoryService.getDirectories();
      return data;
    } catch (err: any) {
      handleHttpErrors(err);
    }
  }
);

export const updateDirectory = createAsyncThunk<void, Partial<IDirectory>, {state: RootState}>(
  "directories/updateDirectory",
  async (directory, {getState, dispatch}) => {
    const { currentDirectory } = getState().directory;
    const prevDirectory = currentDirectory?.children?.find((dir) => dir.id === directory.id);
    if (currentDirectory?.id !== directory.parentId) {
      dispatch(remove(directory.id!))
    }
    else {
      if (prevDirectory) {
        dispatch(updateChildrenDir({id: directory.id!, dir: {
          ...prevDirectory!,
          ...directory,
        }}))
      }
    }
    try {
      await directoryService.updateDirectory(directory.id!, directory);
      await successAlert("Directory updated successfully");
    } catch (err: any) {
      if (prevDirectory) dispatch(add(prevDirectory));
      errorAlert("Directory update failed. Please try again");
      handleHttpErrors(err);
    }
  }
);

export const createDirectoryByUser = createAsyncThunk<void, ICreateDirectory, {state: RootState}>(
  "directories/createDirectory",
  async (directory, {getState, dispatch}) => {
    const { currentDirectory } = getState().directory;
    const id = Math.floor(Math.random() * 10000);
    if (currentDirectory?.id === directory.parentId) {
      dispatch(add({
        id,
        ...directory,
      }))
    }
    try {
      const {data} = await directoryService.createDirectory(directory);
      await successAlert("Directory created successfully");
      dispatch(updateChildrenDir({id, dir: data}));
    } catch (err: any) {
      await errorAlert("Directory create failed. Please try again");
      dispatch(remove(id));
      handleHttpErrors(err);
    }
  }
);

export const deleteDirectoryById = createAsyncThunk<void, number, {state: RootState}>(
  "directories/deleteDirectory",
  async (id, {getState, dispatch}) => {
    try{
      const result = await deleteAlert(
        "Are you sure you want to delete this Directory?",
      );
      if (!result.isConfirmed) return;
    }
    catch(err: any) {}
    const { currentDirectory } = getState().directory;
    const dir = currentDirectory?.children?.find((directory) => directory.id === id);
    if (currentDirectory?.id === dir?.parentId) {
      dispatch(remove(id!))
    }
    try {
      await directoryService.deleteDirectory(id);
      await successAlert("Directory deleted successfully");
    } catch (err: any) {
      if (dir) dispatch(add(dir));
      errorAlert("Directory delete failed. Please try again");
      handleHttpErrors(err);
    }
  }
);

export const getDirectoryByUser = createAsyncThunk<IDirectory, number|undefined|null, { state: RootState }>(
  "directories/getDirectory",
  async (id, { getState }) => {
      const currentDirectoryId = getState().directory?.currentDirectory?.id as number;
      id = id===undefined ? currentDirectoryId : id;
      if (id === null || id === undefined) {
        const { data } = await directoryService.getBaseDirectories();
        return data;
      }
      const { data } = await directoryService.getDirectory(id || null);
      return data;
  }
);

export const initialDirectoryState: {
  directories: IDirectory[];
  currentDirectory: IDirectory;
  editableDirectory: IDirectory | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | "submiteed";
  error: AxiosError | null;
  isOpenedModal: boolean;
  isDragging: boolean;
  toDirectoryId: number | null | undefined;
  directoriesEl: HTMLElement|null;
} = {
  directories: [],
  isOpenedModal: false,
  editableDirectory: null,
  status: "idle",
  currentDirectory: {
    id: undefined,
    name: "",
    children: [],
    todoItem: [],
  },
  isDragging: false,
  toDirectoryId: undefined,
  error: null,
  directoriesEl: null,
};

export const directorySlice = createSlice({
  name: "directory",
  initialState: initialDirectoryState,
  reducers: {
    reset: (state) => {
      state.status = "idle";
      state.error = null;
      state.editableDirectory = null;
    },
    setCurrentDirectory: (state, action: PayloadAction<IDirectory>) => {
      state.currentDirectory = action.payload;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    resetError: (state) => {
      state.error = null
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
    },
    updateChildrenDir: (state, action: PayloadAction<{
      id: number,
      dir: IDirectory,
    }>) => {
      state.currentDirectory.children = state.currentDirectory?.children?.map((directory) => {
        if (directory.id === action.payload.id) {
          return action.payload.dir;
        }
        return directory;
      });
    },
    remove: (state, action: PayloadAction<number>) => {
      state.currentDirectory.children = state?.currentDirectory?.children?.filter((directory) => directory.id !== action.payload);
    },
    add: (state, action: PayloadAction<IDirectory>) => {
      state.currentDirectory?.children?.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      getDirectoriesByUser.fulfilled,
      (state, action: PayloadAction<IDirectory[]>) => {
        state.directories = action.payload;
        state.status = "succeeded";
      },
    );
    builder.addCase(
      getDirectoriesByUser.pending,
      (state) => {
        state.status = "loading";
      }
    );
    builder.addCase(
      getDirectoriesByUser.rejected,
      (state, action) => {
        state.error = action.error as AxiosError;
        state.status = "failed";
      }
    );
    builder.addCase(
      getDirectoryByUser.fulfilled,
      (state, action: PayloadAction<IDirectory>) => {
        state.currentDirectory = action.payload;
        state.status = "succeeded";
      }
    );
    builder.addCase(
      getDirectoryByUser.pending,
      (state) => {
        state.status = "loading";
      }
    );
    builder.addCase(
      getDirectoryByUser.rejected,
      (state, action) => {
        state.error = action.error as AxiosError;
        state.status = "failed";
      }
    )
    builder.addCase(
      updateDirectory.fulfilled,
      (state, action) => {
        state.status = "submiteed";
        state.editableDirectory = null;
      }
    );
    builder.addCase(
      updateDirectory.pending,
      (state) => {
        state.status = "loading";
      }
    );
    builder.addCase(
      updateDirectory.rejected,
      (state, action) => {
        state.error = action.error as AxiosError;
        state.status = "failed";
      }
    );
    builder.addCase(
      createDirectoryByUser.fulfilled,
      (state, action) => {
        state.status = "submiteed";
        state.editableDirectory = null;
      }
    );
    builder.addCase(
      createDirectoryByUser.pending,
      (state) => {
        state.status = "loading";
      }
    );
    builder.addCase(
      createDirectoryByUser.rejected,
      (state, action) => {
        state.error = action.error as AxiosError;
        state.status = "failed";
      }
    );
    builder.addCase(
      deleteDirectoryById.fulfilled,
      (state, action) => {
        state.status = "succeeded";
      }
    );
    builder.addCase(
      deleteDirectoryById.pending,
      (state) => {
        state.status = "loading";
      }
    );
    builder.addCase(
      deleteDirectoryById.rejected,
      (state, action) => {
        state.error = action.error as AxiosError;
        state.status = "failed";
      }
    );
  },
});

export const selectDirectory = (state: RootState) => state.directory;

export const { reset, remove, updateChildrenDir, add, setError, resetError, setToDirectoryId, setCurrentDirectory, updateTodoItem, updateTodoItems, setIsDragging, setIsOpenedModal, setEditableDirectory, setDirectoriesEl } = directorySlice.actions;

export default directorySlice.reducer;
