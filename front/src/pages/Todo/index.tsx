import { FC, useEffect, useRef, useState } from "react";
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
import AddItemModal from "../../components/AddItem";
import { selectDirectory, setIsOpenedModal } from "../../features/directorySlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Todo: FC = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  
  const { search, updateSearch } = useSearch();

  const {currentDirectory, isLoading, error} = useDirectory(Number(id) || null);

  const { children, todoItem } = currentDirectory;

  const todoListFiltered = todoItem?.filter((item) => {
    return item.description.toLowerCase().includes(search.toLowerCase());
  });

  const handleSearch = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    updateSearch(value);
  };

  const subDirectoriesFiltered = children?.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  const dispatch = useDispatch();


  const [type, setType] = useState<'directory' | 'task' | ''>('');

  const handleAddItem = (type: 'directory' | 'task' | '') => {
    setType(type);
    dispatch(setIsOpenedModal(true));
  }

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

  const [scheduledPercentage, setScheduledPercentage] = useState(0);

  const [completedPercentage, setCompletedPercentage] = useState(0);

  useEffect(() => {
    const completedPercentage = (todoItem!?.filter((item) => item.selected).length / todoItem!?.length) * 100 || 0;
    setCompletedPercentage(completedPercentage);
    const scheduledTasks = todoItem?.filter((item) => item.notification?.active);
    const scheduledPercentage = (scheduledTasks!?.length / todoItem!?.length) * 100 || 0;
    setScheduledPercentage(scheduledPercentage);
  }, [todoItem]);

  const foldersContainerRef = useRef<HTMLDivElement>(null);

  const sortByCreatedAt = [...todoItem!]?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const lastCreatedTask = sortByCreatedAt[0];

  const scheduledTasks = todoItem?.filter((item) => item.notification?.active);

  return (
    <StyledCenterContainer>
      {/* <StyledH1>{currentDirectory.name}</StyledH1> */}
      <>
        <Header>
          <StyledBackButton onClick={()=>{navigate(-1)}}>Back</StyledBackButton>
          <BreadCrumb />
        </Header>
        {/* <SearchBar search={search} handleSearch={handleSearch} /> */}
        {!isLoading && !search && (
          <StyledDiv>
          <h2>Stats</h2>
          <StatsContainer>
            <StyledCard>
              <StatsTextContainer>
                <h4>Tasks Progress</h4>
                <p><span>{todoItem?.filter((item) => item.selected).length}</span> out of <span>{todoItem?.length}</span> Done</p>
              </StatsTextContainer>
              <div style={{ width: 80, height: 80 }}>
                <CircularProgressbar minValue={0} value={completedPercentage} text={`${completedPercentage.toFixed(2)}%`} counterClockwise={true} styles={buildStyles({

                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: 'round',

                // Text size
                textSize: '16px',

                // How long animation takes to go from one percentage to another, in seconds
                pathTransitionDuration: 1,

                // Can specify path transition in more detail, or remove it entirely
                // pathTransition: 'none',

                // Colors
                pathColor: `#000000`,
                textColor: '#000000',
                trailColor: '#d6d6d6',
                })} />
              </div>
            </StyledCard>
            <StyledCard>
              <StatsTextContainer>
                <h4>Scheduled Tasks</h4>
                <p><span>{scheduledTasks?.length}</span> out of <span>{todoItem?.length}</span> Scheduled</p>
              </StatsTextContainer>
              <div style={{ width: 80, height: 80 }}>
                <CircularProgressbar minValue={0} value={scheduledPercentage} text={`${scheduledPercentage.toFixed(2)}%`} counterClockwise={true} styles={buildStyles({

                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: 'round',

                // Text size
                textSize: '16px',

                // How long animation takes to go from one percentage to another, in seconds
                pathTransitionDuration: 1,

                // Can specify path transition in more detail, or remove it entirely
                // pathTransition: 'none',

                // Colors
                pathColor: `#000000`,
                textColor: '#000000',
                trailColor: '#d6d6d6',
                })} />
              </div>
            </StyledCard>
            <StyledCard>
              <StatsTextContainer>
                <h4>{currentDirectory.name} Folders</h4>
                <p><span>{children?.length}</span> Folders</p>
              </StatsTextContainer>
            </StyledCard>
            <StyledCard>
              <StatsTextContainer>
                <h4>Last Created Task</h4>
                <p>{lastCreatedTask?.description || 'No tasks'}</p>
              </StatsTextContainer>
            </StyledCard>
          </StatsContainer>
        </StyledDiv>
        )}
        <AddItemModal type={type} />
        {isLoading ? (
          <Loader />
        ) : (
            <StyledDiv>
              <DirectoriesList directories={subDirectoriesFiltered ?? []} handleAddItem={handleAddItem} foldersContainerRef={foldersContainerRef}/>
              <TodoItemList todoList={todoListFiltered ?? []} handleAddItem={handleAddItem} foldersContainerRef={foldersContainerRef}/>
            </StyledDiv>
        )}
      </>
    </StyledCenterContainer>
  );
};

export default Todo;

const StatsTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  justify-content: center;
  margin: 0;
  gap: 10px;
  p, h4 {
    font-size: 0.8rem;
    margin: 0;
    span {
      font-weight: 600;
    }
  }
`;

const StatsContainer = styled.div`
 width: 100%;
 flex-wrap: wrap;
 display: flex;
 gap: 20px
`

const StyledCard = styled.div`
  display: flex;
  width: 200px;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px; 
  flex-grow: 1;
  padding: 10px;
  gap: 20px;
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

const Header = styled.div`
  display: flex;
  padding: 1rem;
  flex-wrap: wrap;
  width: 100%;
`;

const StyledCenterContainer = styled(StyledContainer)`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  padding: 1rem;
  gap: 10px;
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;  
  align-items: stretch;
  width: 100%;
`;
