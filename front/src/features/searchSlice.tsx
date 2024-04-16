import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { IDirectory } from "../interfaces/Directory/IDirectory";
import { directoryService } from "../services/directories";
import { ITodoItem } from "../interfaces/TodoItem/ITodoItem";

export const getSearchedItems = createAsyncThunk<SearchData, string>(
  "search/getSearchedItems",
  async (search) => {
    const response = await directoryService.getBySearchDirectories(search);
    return response.data;
  }
);

interface SearchData {
  directories: IDirectory[];
  todoItems: ITodoItem[];
}
interface SearchState {
  search: string;
  data: SearchData;
}

const searchSlice = createSlice({
  name: "search",
  initialState: {
    search: "",
    data: {
      directories: [],
      todoItems: [],
    },
  } as SearchState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
        state.search = action.payload;
    },
    setData(state, action: PayloadAction<SearchData>) {
        state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getSearchedItems.fulfilled,
      (state, action) => {
        state.data = action.payload;
      }
    );
  }
});


export const selectSearch = (state: RootState) => state.search;

export const { setSearch, setData } = searchSlice.actions;

export default searchSlice.reducer;
