import { useSelector } from "react-redux"
import { getDirectoryByUser, selectDirectory, setCurrentDirectory } from "../features/directorySlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { IDirectory } from "../interfaces/Directory/IDirectory";
import { ActionFromReducer } from "redux";



const useDirectory = (
    directoryId?: number|null
) => {
    const { currentDirectory, isLoading, error } = useSelector(selectDirectory);

    const dispatch = useDispatch();

    useEffect(() => {
        if (directoryId===undefined) {
            return;
        }
        dispatch(getDirectoryByUser(directoryId) as ActionFromReducer<IDirectory>);
    }, [dispatch, directoryId]);


    return { currentDirectory, isLoading, error };
}

export default useDirectory;