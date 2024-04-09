import { FC, useEffect, useRef, useState } from "react"
import { IDirectory } from "../../interfaces/Directory/IDirectory";
import { StyledDeleteButton, StyledEditButton, StyledH3 } from "../Common/Styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { deleteDirectoryById, selectDirectory, setEditableDirectory, setIsOpenedModal } from "../../features/directorySlice";
import { ActionFromReducer } from "redux";
import { useDispatch } from "react-redux";
import NotFound from "../NotFound";
import { useSelector } from "react-redux";


type DirectoriesListProps = {
    directories: IDirectory[];
    handleAddItem: (type: 'directory' | 'task') => void;
    foldersContainerRef: React.RefObject<HTMLDivElement>;
}

const DirectoriesList: FC<DirectoriesListProps> = ({directories, handleAddItem, foldersContainerRef}) => {

    const {id} = useParams();

    const isHome = id === undefined;

    const {currentDirectory} = useSelector(selectDirectory);

    return (
        <DirectoriesContainer>
        <h2>Folders</h2>
        {/* {directories?.length === 0 && (
            <NotFound title="Directory" text="Add one with button below" />
        )} */}
        <TodosContainer ref={foldersContainerRef}>
          <StyledCard isDragging={false} onClick={() => handleAddItem('directory')}>
            <i className="fi fi-rr-add"></i>
            <p>Add a new Directory</p>
          </StyledCard>
          {!isHome && (
            <Directory 
            key={'back'} 
            directory={{
              id: currentDirectory?.parentId || '',
              name: '../',
              created_at: new Date(),
              updated_at: new Date(),
            }}
            />
          )}
          {directories?.map((directory) => {
            return <Directory key={directory?.id} directory={directory} />
          }
          )}
          </TodosContainer>
        </DirectoriesContainer>    
)
}

export default DirectoriesList


const Directory = ({directory, onClick}: any) => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { isDragging } = useSelector(selectDirectory);

  const handleDelete = async (e: any, id: number) => {
      e.stopPropagation();
      dispatch(deleteDirectoryById(id) as ActionFromReducer<IDirectory[]>);
  };

  const [isOpened, setIsOpened] = useState(false);

  const menuRef = useRef(null);

  const handleEdit = (e: any)  => {
    e.stopPropagation();
    setIsOpened(false);
    dispatch(setEditableDirectory(directory) as ActionFromReducer<IDirectory>);
    dispatch(setIsOpenedModal(true));
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      event.stopPropagation();
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setIsOpened(false);
      }
    }
  
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

    return (
      <StyledCard isDragging={isDragging} key={directory?.id} id={"directory-" + directory?.id} onClick={() => navigate(`/directories/${directory?.id}`)}>
      <RighTopCorner ref={menuRef}>
        <Icon className="fi fi-bs-menu-dots-vertical" onClick={
          (event) => {
            event.stopPropagation();
            setIsOpened(!isOpened)
          }
          }>
        </Icon>
        {isOpened && (
          <Menu>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={(e) => handleDelete(e, directory?.id as number)}>Delete</MenuItem>
          </Menu>
        )}
      </RighTopCorner>
      <CardHeader>
        <StyledName>
          <i className="fi fi-sr-folder-open" style={{marginRight: "4px"}}></i>
          {directory?.name}
        </StyledName>
      </CardHeader>
      {/* <ActionsContainer >
        <Link to={`/directories/${directory?.id}`}>
          <StyledEditButton>View Details</StyledEditButton>
        </Link>
        <StyledDeleteButton onClick={() => handleDelete(directory?.id as number)}>
          Delete
        </StyledDeleteButton>
      </ActionsContainer> */}
    </StyledCard>
    )
}

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const Icon = styled.i`
  cursor: pointer;
  padding: 5px;
  &:hover {
    background-color: #f2f2f2;
    border-radius: 5px;
  }
`;

const MenuItem = styled.li`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: red;
    font-weight: 500;
  }
`;

const Menu = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: absolute;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 100;
  top: 10px;
  font-size: 0.8rem;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  list-style: none;
`;

const RighTopCorner = styled.div`
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  right: 4px;
`;

const TodosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  text-align: left;
  width: 100%;
  gap: 10px;
`;

const DirectoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  text-align: left;
  width: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
`;

const StyledName = styled.h3`
  margin: 0;
  padding: 10px;
  flex-grow: 4;
  font-size: 0.8rem;
  flex: 1;
  margin-left: 4px;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  font-size: 2px;
`;

const StyledCard = styled.div<{isDragging: boolean}>`
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  align-items: center;
  flex-direction: column;
  background-color: ${(props) => (props.isDragging ? "#f2f2f2" : "white")};
  border: ${(props) => (props.isDragging ? "2px dashed #ccc" : "1px solid #ccc")};
  border-radius: 5px;
  padding: 10px;
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
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;