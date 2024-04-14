import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectTodoItems, setSearch } from "../features/todoItemsSlice";
import { useDispatch } from "react-redux";




const useSearch = () => {

  const { search } = useSelector(selectTodoItems);

  const dispatch = useDispatch();

  const updateSearch = (value: string) => {
    dispatch(setSearch(value));
  }

  return { search , updateSearch};
}

export default useSearch;