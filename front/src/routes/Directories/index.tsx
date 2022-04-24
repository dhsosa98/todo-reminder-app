import { SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ICreateDirectory } from "../../interfaces/ICreateDirectory";
import { IDirectory } from "../../interfaces/IDirectory";
import {
  createDirectory,
  deleteDirectory,
  getDirectories,
} from "../../services/directories";
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
  StyledH2,
  StyledH3,
  StyledInput,
  StyledWrapperSection,
} from "../../components/Common/Styled-components";

const Directories = () => {
  const [directories, setDirectories] = useState<IDirectory[]>([]);
  const [newDirectory, setNewDirectory] = useState<ICreateDirectory>({
    name: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleDirectories = async () => {
    try{
    setIsLoading(true);
    const { data } = await getDirectories();
    setDirectories(data);
  } finally{
    setIsLoading(false);
  }
  };

  useEffect(() => {
    handleDirectories();
  }, []);

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setNewDirectory({ name: value });
    setError("");
  };

  const handleSubmit = async () => {
    try {
      if (newDirectory.name.length < 3) {
        setError("Please enter a Directory name of at least 3 characters");
      }
      await createDirectory(newDirectory);
      handleDirectories();
      setNewDirectory({ name: "" });
    } catch (err: any) {
      console.log({ err });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteDirectory(id);
    handleDirectories();
  };

  return (
    <StyledContainer>
      <StyledH1>Directories</StyledH1>
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {directories.length === 0 && <NotFound title="directory" />}
            {directories.map((directory) => (
              <StyledCard key={directory.id}>
                <StyledH2>
                  {"- "}
                  {directory.name}
                </StyledH2>
                <Link to={`/${directory.id}`}>
                  <StyledEditButton>View Details</StyledEditButton>
                </Link>
                <StyledDeleteButton onClick={() => handleDelete(directory.id)}>
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
        <StyledInput value={newDirectory.name} onChange={handleChange} />
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
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
`;
