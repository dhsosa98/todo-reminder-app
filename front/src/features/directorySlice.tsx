import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { ICreateDirectory } from "../interfaces/Directory/ICreateDirectory";
import { IDirectory } from "../interfaces/Directory/IDirectory";
import {directoryService} from "../services/directories";
import handleErrors from "../utilities/errors";
import { deleteAlert, successAlert } from "../utilities/sweetalert";

export const getDirectoriesByUser = createAsyncThunk<IDirectory[]>(
  "directories/getDirectories",
  async (_, { dispatch }) => {
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
    } catch (err) {
      handleErrors(err, dispatch, setError);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const getDirectoryByUser = createAsyncThunk<IDirectory, number>(
  "directories/getDirectory",
  async (id, { dispatch }) => {
    try {
      dispatch(setIsLoading(true));
      const { data } = await directoryService.getDirectory(id);
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
  directory: ICreateDirectory;
  isLoading: boolean;
  error: string;
} = {
  directories: [],
  directory: {
    name: "",
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
    setDirectory: (state, action: PayloadAction<ICreateDirectory>) => {
      state.directory = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = "";
    }
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
        state.directory = action.payload;
      }
    );
  },
});

export const selectDirectory = (state: RootState) => state.directory;

export const { setIsLoading, setError, setDirectory, resetError } = directorySlice.actions;

export default directorySlice.reducer;
