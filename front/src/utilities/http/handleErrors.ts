import { AxiosError } from "axios";


const handleHttpErrors = (err: AxiosError) => {
    if (err?.response?.status === 404) {
        throw new Error("The requested resource was not found");
      }
      if (err?.response?.status === 400) {
        throw new Error(err.response.data.message);
      }
      if (err?.response?.status === 401) {
        throw new Error("The session has expired!, Please log in again")
      }
      if (err?.response?.data?.message) {
        throw new Error("Error" + err.response.data.message);
    }
    throw new Error("Something went wrong, Please try again later");
}

export default handleHttpErrors;