import { configureStore } from "@reduxjs/toolkit";
import directory from "../features/directorySlice";
import auth from "../features/authSlice";
import thunk from "redux-thunk";
import todoitems from "../features/todoItemsSlice";

const store = configureStore({
    reducer: {
        "auth": auth,
        "directory": directory,
        "todoitems": todoitems

    },
    middleware: [thunk]
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store;