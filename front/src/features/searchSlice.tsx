import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    search: "",
  },
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
        state.search = action.payload;
    }
  },
});


export const selectSearch = (state: RootState) => state.search;

export const { setSearch } = searchSlice.actions;

export default searchSlice.reducer;
