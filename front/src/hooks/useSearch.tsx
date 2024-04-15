import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectSearch, setSearch } from "../features/searchSlice";




const useSearch = () => {

  const { search } = useSelector(selectSearch);

  const dispatch = useDispatch();

  const updateSearch = (value: string) => {
    dispatch(setSearch(value));
  }

  return { search , updateSearch};
}

export default useSearch;