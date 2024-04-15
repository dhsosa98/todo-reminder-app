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
import {setSearch, todoItemsSlice} from "./todoItemsSlice";
import store from "../app/store";
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

export const updateDirectory = createAsyncThunk<void, Partial<IDirectory>>(
  "directories/updateDirectory",
  async (directory) => {
    try {
      await directoryService.updateDirectory(directory.id!, directory);
    } catch (err: any) {
      handleHttpErrors(err);
    }
  }
);

export const createDirectoryByUser = createAsyncThunk<void, ICreateDirectory>(
  "directories/createDirectory",
  async (directory) => {
    try {
      await directoryService.createDirectory(directory);
    } catch (err: any) {
      handleHttpErrors(err);
    }
  }
);

export const deleteDirectoryById = createAsyncThunk<void, number>(
  "directories/deleteDirectory",
  async (id) => {
    try {
      await directoryService.deleteDirectory(id);
    } catch (err: any) {
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

export const { reset, setError, resetError, setToDirectoryId, setCurrentDirectory, updateTodoItem, updateTodoItems, setIsDragging, setIsOpenedModal, setEditableDirectory, setDirectoriesEl } = directorySlice.actions;

export default directorySlice.reducer;
