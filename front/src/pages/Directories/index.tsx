import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ICreateDirectory } from "../../interfaces/Directory/ICreateDirectory";
import { IDirectory } from "../../interfaces/Directory/IDirectory";
import styled from "styled-components";
import NotFound from "../../components/NotFound";
import Loader from "../../components/Common/Loader";
import {
  StyledAddButton,
  StyledContainer,
  StyledDeleteButton,
  StyledEditButton,
  StyledErrorParagraph,
  StyledH1,
  StyledH3,
  StyledInput,
  StyledWrapperSection,
} from "../../components/Common/Styled-components";
import { useDispatch } from "react-redux";
import {
  createDirectoryByUser,
  deleteDirectoryById,
  getDirectoriesByUser,
  resetError,
  selectDirectory,
} from "../../features/directorySlice";
import { useSelector } from "react-redux";
import { ActionFromReducer } from "redux";

const Directories = () => {
  const { directories, isLoading, error } = useSelector(selectDirectory);
  const initialDirectory: ICreateDirectory = {
    name: "",
  };
  const [newDirectory, setNewDirectory] =
    useState<ICreateDirectory>(initialDirectory);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDirectoriesByUser() as ActionFromReducer<IDirectory[]>);
    return () => {
      dispatch(resetError());
    }
  }, [dispatch]);


  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setNewDirectory({ name: value });
    dispatch(resetError());
  };

  const handleSubmit = async () => {
    dispatch(
      createDirectoryByUser(newDirectory) as ActionFromReducer<IDirectory>
    );
    setNewDirectory(initialDirectory);
  };

  const handleDelete = async (id: number) => {
    dispatch(deleteDirectoryById(id) as ActionFromReducer<IDirectory[]>);
  };

  return (
    <StyledContainer>
      <StyledH1>Directories</StyledH1>
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {directories?.length === 0 && (
              <NotFound title="directory" text="Add one with button below" />
            )}
            {directories?.map((directory) => (
              <StyledCard key={directory?.id}>
                <StyledH3>
                  {"- "}
                  {directory?.name}
                </StyledH3>
                <Link to={`${directory?.id}/todoitems`}>
                  <StyledEditButton>View Details</StyledEditButton>
                </Link>
                <StyledDeleteButton onClick={() => handleDelete(directory?.id)}>
                  Delete
                </StyledDeleteButton>
              </StyledCard>
            ))}
          </>
        )}
      </>
      <StyledWrapperSection>
        <StyledH3>Add Directory</StyledH3>
        <StyledWrapper>
          <StyledInput
            placeholder="Home"
            value={newDirectory?.name}
            onChange={handleChange}
          />
          <StyledAddButton onClick={handleSubmit}>Add</StyledAddButton>
        </StyledWrapper>
        {error && <StyledErrorParagraph>{error}</StyledErrorParagraph>}
      </StyledWrapperSection>
    </StyledContainer>
  );
};
export default Directories;

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  gap: 20px;
`;

const StyledCard = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #3a60b7;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  animation: myAnim 0.4s ease-in 0s 1 normal forwards;
  @keyframes myAnim {
    0% {
      opacity: 0;
      transform: translateX(50px);
    }

    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
