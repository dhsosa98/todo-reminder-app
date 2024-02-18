import { FC } from "react"
import { IDirectory } from "../../interfaces/Directory/IDirectory";
import { StyledDeleteButton, StyledEditButton, StyledH3 } from "../Common/Styled-components";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { deleteDirectoryById } from "../../features/directorySlice";
import { ActionFromReducer } from "redux";
import { useDispatch } from "react-redux";


type DirectoriesListProps = {
    directories: IDirectory[];
}

const DirectoriesList: FC<DirectoriesListProps> = ({directories}) => {

    const dispatch = useDispatch();

    const handleDelete = async (id: number) => {
        dispatch(deleteDirectoryById(id) as ActionFromReducer<IDirectory[]>);
    };

    return (
        <>
        {directories?.map((directory) => (
              <StyledCard key={directory?.id}>
                <StyledName>
                  {"- "}
                  {directory?.name}
                </StyledName>
                <ActionsContainer >
                  <Link to={`/directories/${directory?.id}`}>
                    <StyledEditButton>View Details</StyledEditButton>
                  </Link>
                  <StyledDeleteButton onClick={() => handleDelete(directory?.id as number)}>
                    Delete
                  </StyledDeleteButton>
                </ActionsContainer>
              </StyledCard>
            ))}
        </>    
)
}

export default DirectoriesList

const StyledName = styled.h3`
  margin: 0;
  padding: 10px;
  flex-grow: 2;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledCard = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  background-color: white;
  color: #3a60b7;
  border-radius: 5px;
  font-size: 1rem;
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