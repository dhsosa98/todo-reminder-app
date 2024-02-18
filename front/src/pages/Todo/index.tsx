import { FC, useEffect } from "react";
import { SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import NotFound from "../../components/NotFound";
import Loader from "../../components/Common/Loader";
import {
  StyledBackButton,
  StyledContainer,
  StyledH1,
  StyledH2,
} from "../../components/Common/Styled-components";
import TodoItemList from "../../components/TodoItemList";
import DirectoriesList from "../../components/DirectoriesList";
import SearchBar from "../../components/SearchBar";
import AddItem from "../../components/AddItem";
import useDirectory from "../../hooks/useDirectory";
import useSearch from "../../hooks/useSearch";
import BreadCrumb from "../../components/Breadcrumb";

const Todo: FC = () => {
  const { id } = useParams();

  useEffect(() => {
    console.log("Todo page");
  },[]);

  const navigate = useNavigate();
  
  const { search, updateSearch } = useSearch();

  const {currentDirectory, isLoading, error} = useDirectory(Number(id));

  const { children, todoItem } = currentDirectory;

  const handleSearch = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    updateSearch(value);
  };

  const todoListFiltered = todoItem?.filter((item) => {
    return item.description.toLowerCase().includes(search.toLowerCase());
  });

  const subDirectoriesFiltered = children?.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });





 

  if (error === "Not Found") {
    return (
      <StyledCenterContainer>
        <StyledH1>Not Found</StyledH1>
        <NotFound title="Directory with that ID">
          <StyledBackButton onClick={()=>{navigate(-1)}}>Back</StyledBackButton>
        </NotFound>
      </StyledCenterContainer>
    );
  }

  return (
    <StyledCenterContainer>
      <StyledH1>To-do List</StyledH1>
      <>
        <BreadCrumb />
        <SearchBar search={search} handleSearch={handleSearch} />
        <AddItem  />
        {isLoading ? (
          <Loader />
        ) : (
            <StyledDiv>
              <DirectoriesList directories={subDirectoriesFiltered ?? []} />
              <TodoItemList todoList={todoListFiltered ?? []} />
            </StyledDiv>
        )}
      </>
    </StyledCenterContainer>
  );
};

export default Todo;

const StyledCenterContainer = styled(StyledContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.8rem;
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
