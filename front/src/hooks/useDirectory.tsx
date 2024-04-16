import { useSelector } from "react-redux"
import { getDirectoryByUser, selectDirectory, setCurrentDirectory } from "../features/directorySlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { IDirectory } from "../interfaces/Directory/IDirectory";
import { ActionFromReducer } from "redux";



const useDirectory = (
    directoryId?: number|null
) => {
    const { currentDirectory, error, status, ...rest } = useSelector(selectDirectory);

    const isLoading = false && status === "loading";

    const dispatch = useDispatch();

    useEffect(() => {
        if (directoryId===undefined || directoryId===currentDirectory?.id) {
            return;
        }
        dispatch(getDirectoryByUser(directoryId) as ActionFromReducer<IDirectory>);
    }, [dispatch, directoryId]);


    return {
        ...rest,
        isLoading,
        currentDirectory,
        error,
        status,
    }
}

export default useDirectory;