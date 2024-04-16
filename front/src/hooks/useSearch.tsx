import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getSearchedItems, selectSearch, setSearch } from "../features/searchSlice";
import { ActionFromReducer, Dispatch } from "redux";
import { debounce } from "lodash";




const useSearch = () => {

  const { search, data } = useSelector(selectSearch);

  const dispatch = useDispatch(); 

  const updateSearch = (value: string) => {
    dispatch(setSearch(value));
  }

  const debouncedSearch = debounce((value: string) => {
    dispatch(getSearchedItems(value) as ActionFromReducer<string>);
  }, 500);

  useEffect(() => {
    if (search) {
      debouncedSearch(search);
    }
  }, [search]);

  return { search , updateSearch, data };
}

export default useSearch;