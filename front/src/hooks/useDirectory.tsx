import { useSelector } from "react-redux"
import { getDirectoryByUser, selectDirectory } from "../features/directorySlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { IDirectory } from "../interfaces/Directory/IDirectory";
import { ActionFromReducer } from "redux";



const useDirectory = (
    directoryId?: number
) => {
    const { currentDirectory, isLoading, error } = useSelector(selectDirectory);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!directoryId) {
            return;
        }
        dispatch(getDirectoryByUser(directoryId) as ActionFromReducer<IDirectory>);
    }, [dispatch, directoryId]);


    return { currentDirectory, isLoading, error };
}

export default useDirectory;