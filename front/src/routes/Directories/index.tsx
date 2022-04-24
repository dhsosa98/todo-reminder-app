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

const Directories = () => {
  const [directories, setDirectories] = useState<IDirectory[]>([]);
  const [newDirectory, setNewDirectory] = useState<ICreateDirectory>({
    name: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleDirectories = async () => {
    setIsLoading(true);
    const { data } = await getDirectories();
    setIsLoading(false);
    setDirectories(data);
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
          <StyledH3>Loading...</StyledH3>
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
                  <StyledDetailsButton>View Details</StyledDetailsButton>
                </Link>
                <StyledDeleteButton onClick={() => handleDelete(directory.id)}>
                  Delete
                </StyledDeleteButton>
              </StyledCard>
            ))}
          </>
        )}
      </>
      <StyledWrapper>
        <StyledInput value={newDirectory.name} onChange={handleChange} />
        <StyledAddButton onClick={handleSubmit}>Add Directory</StyledAddButton>
      </StyledWrapper>
      {error && <StyledErrorParagraph>{error}</StyledErrorParagraph>}
    </StyledContainer>
  );
};
export default Directories;

const StyledH3 = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  gap: 20px;
`;

const StyledH2 = styled.h2`
  color: red;
`;

const StyledInput = styled.input`
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
`;

const StyledH1 = styled.h1`
  color: red;
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

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  font-size: 0.8rem;
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StyledDetailsButton = styled.button`
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  background-color: #5290c2;
  color: white;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  border: none;
`;

const StyledDeleteButton = styled.button`
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  background-color: #cd1818;
  color: white;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  border: none;
`;

const StyledAddButton = styled.button`
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  background-color: #5290c2;
  color: white;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  border: none;
`;

const StyledErrorParagraph = styled.p`
  color: red;
`;
