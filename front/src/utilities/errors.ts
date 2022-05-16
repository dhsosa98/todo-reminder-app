import { LOGOUT } from "../features/authSlice";
import { infoAlert } from "./sweetalert";


const handleErrors = (err: any, dispatch: any, setError: any) => {
    if (err.response.status === 404) {
        dispatch(setError("Not Found"))
        return;
      }
    if (err.response.status === 401) {
        infoAlert("The session has expired!", "Please log in again")
        dispatch(LOGOUT())
        return;
    }
    dispatch(setError("Something went wrong"));
}

export default handleErrors;