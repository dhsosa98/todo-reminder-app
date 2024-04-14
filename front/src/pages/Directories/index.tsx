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
import Draggable from "react-draggable";
import DirectoriesList from "../../components/DirectoriesList";

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

  return (
    <StyledContainer>
      <StyledH1>Directories</StyledH1>
      {/* <StyledWrapperSection>
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
      </StyledWrapperSection> */}
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {directories?.length === 0 && (
              <NotFound title="directory" text="Add one with button below" />
            )}
            {/* <DirectoriesList directories={directories} /> */}
          </>
        )}
      </>
    </StyledContainer>
  );
};
export default Directories;

const StyledWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  gap: 20px;
`;
