import { Middleware, MiddlewareAPI, configureStore, isRejected, isRejectedWithValue } from "@reduxjs/toolkit";
import directory from "../features/directorySlice";
import auth from "../features/authSlice";
import thunk from "redux-thunk";
import todoitems from "../features/todoItemsSlice";
import { errorAlert } from "../utilities/sweetalert";
import search from "../features/searchSlice";

export const httpErrorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    // if (isRejected(action)) {
    //     errorAlert(
    //         'Error',
    //         'data' in action.error
    //             ? (action.error.data as { message: string }).message
    //             : action.error.message,
    //     )
    // }

    return next(action)
  }




const store = configureStore({
    reducer: {
        "auth": auth,
        "directory": directory,
        "todoitems": todoitems,
        "search": search

    },
    middleware: [thunk, httpErrorMiddleware]
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store;