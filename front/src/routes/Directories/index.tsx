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
import { deleteAlert, successAlert } from "../../utilities/sweetalert";

const Directories = () => {
  const [directories, setDirectories] = useState<IDirectory[]>([]);
  const [newDirectory, setNewDirectory] = useState<ICreateDirectory>({
    name: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleDirectories = async () => {
    try {
      setIsLoading(true);
      const { data } = await getDirectories();
      setDirectories(data);
    } catch (err: any) {
      setError("Something went wrong");
    } finally {
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
        return;
      }
      await createDirectory(newDirectory);
      await successAlert("The Directory has been Created Successfully");
      handleDirectories();
      setNewDirectory({ name: "" });
    } catch (err: any) {
      setError("Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAlert('Are you sure you want to delete this Directory?', 'The Directory has been deleted Successfully');
      await deleteDirectory(id);
      handleDirectories();
    } catch (err: any) {
      setError("Something went wrong");
    }
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
                <StyledH3>
                  {"- "}
                  {directory.name}
                </StyledH3>
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
