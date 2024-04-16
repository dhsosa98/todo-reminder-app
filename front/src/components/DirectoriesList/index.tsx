import { FC, useEffect, useRef, useState } from "react"
import { IDirectory } from "../../interfaces/Directory/IDirectory";
import { StyledDeleteButton, StyledEditButton, StyledH3 } from "../Common/Styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { deleteDirectoryById, reset, selectDirectory, setDirectoriesEl, setEditableDirectory, setIsDragging, setIsOpenedModal, setToDirectoryId, updateDirectory } from "../../features/directorySlice";
import { ActionFromReducer } from "redux";
import { useDispatch } from "react-redux";
import NotFound from "../NotFound";
import { useSelector } from "react-redux";
import dragSrc from '/drag.svg';
import { ref } from "yup";
import { DNDPlugin, addEvents, animations, eventCoordinates, handleDragoverNode, handleDragstart, handleEnd, handleTouchOverNode, handleTouchmove, handleTouchstart, parents, setupNode, state, SetupNodeData, NodeEventData } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { deleteAlert, successAlert } from "../../utilities/sweetalert";
import useSearch from "../../hooks/useSearch";
import { selectSearch } from "../../features/searchSlice";

type DirectoriesListProps = {
    directories: IDirectory[];
    handleAddItem: () => void;
    foldersContainerRef: React.RefObject<HTMLDivElement>;
}

function validateDragHandle<T>(data: NodeEventData<T>): boolean {
  if (!(data.e instanceof DragEvent) && !(data.e instanceof TouchEvent))
    return false;

  const config = data.targetData.parent.data.config;

  if (!config.dragHandle) return true;

  const dragHandles = data.targetData.node.el.querySelectorAll(
    config.dragHandle
  );

  if (!dragHandles) return false;

  const coordinates = eventCoordinates(data.e);

  const elFromPoint = config.root.elementFromPoint(
    coordinates.x,
    coordinates.y
  );

  if (!elFromPoint) return false;

  for (const handle of Array.from(dragHandles)) {
    if (elFromPoint === handle || handle.contains(elFromPoint)) return true;
  }

  return false;
}

function eventEndCoordinates(e: MouseEvent | TouchEvent) {
  if (e instanceof MouseEvent) {
    return {
      x: e.clientX,
      y: e.clientY,
    };
  } else {
    return {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
  }
}

const DirectoriesList: FC<DirectoriesListProps> = ({directories, handleAddItem, foldersContainerRef}) => {

    const {id} = useParams();

    const isHome = id === undefined;

    const dispatch = useDispatch();

    const {currentDirectory} = useSelector(selectDirectory);

    directories = !isHome ? [{
      id: currentDirectory?.parentId || null as any,
      name: '../',
    }, ...directories] : directories;

    function getPrevElement(element: HTMLElement | null, parentNode: Element): Element | null {
      let prevElement = null;
      while (element && element !== parentNode) {
        prevElement = element;
        element = element.parentElement;
      }
      if (element === parentNode) {
        return prevElement
      }
      return null
    }

  const [ref, dirs, _setValues] = useDragAndDrop<HTMLDivElement, IDirectory>(directories, {
      group: "directories",
      sortable: false,
      dragHandle: ".drag-handle",
      draggable: (el) => {
        return el.id !== "no-drag";
      },  
      handleDragstart: (data) => {
        dispatch(
          setToDirectoryId(undefined)
        ); 
        handleDragstart(data);
        if (!validateDragHandle(data)) return;
      },
      handleTouchstart: (data) => {
        handleTouchstart(data);
        dispatch(
          setToDirectoryId(undefined)
        );
        if (!validateDragHandle(data)) return;
        dispatch(
          setIsDragging(true)
        )
      },
      handleTouchOverNode: (data) => {
        handleTouchOverNode(data);
        const toId = data.detail.targetData.node.data.value.id;
        dispatch(
          setToDirectoryId(toId)
        );
      },
      handleDragoverNode({e, targetData}) {
        handleDragoverNode({e, targetData});
        const toId = targetData.node.data.value.id;
        dispatch(
          setToDirectoryId(toId)
        );
      },
      handleEnd: ({e, targetData}) => {
        handleEnd({e, targetData});
        dispatch(
          setIsDragging(false)
        );
        dispatch(
          setToDirectoryId(undefined)
        );
        const config = targetData.parent.data.config;
        const coordinates = eventEndCoordinates(e);
        let toElement = config.root.elementFromPoint(coordinates.x, coordinates.y);  
        toElement = getPrevElement(toElement as HTMLElement, targetData.parent.el);
        if (!toElement) return;
        const toId = targetData.parent.data.enabledNodes.find((node) => node.el === toElement)?.data.value.id;
        const fromId = targetData.node.data.value.id;
        if (toId===undefined || !fromId || toId === fromId) return;
        dispatch(
          updateDirectory({
            id: fromId,
            parentId: toId || null,
          }) as ActionFromReducer<Partial<IDirectory>>
        )
      },
    })

    useEffect(() => {
      dispatch(
        setDirectoriesEl(ref.current)
      );
    }, [ref.current]);

    useEffect(() => {
      _setValues(directories);
    }, [JSON.stringify(directories)]);

    return (
        <DirectoriesContainer>
        <h2>Folders</h2>
        {/* {directories?.length === 0 && (
            <NotFound title="Directory" text="Add one with button below" />
        )} */}
        <TodosContainer ref={ref}>
          <AddNewDirectoryCard id="no-drag" isDragging={false} onClick={() => {
            dispatch(
              setEditableDirectory({} as IDirectory)
            );
            handleAddItem()
          }}>
            <i className="fi fi-rr-add"></i>
            <p>Add a new Directory</p>
          </AddNewDirectoryCard>
          {dirs?.map((directory) => {
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

  const { isDragging, toDirectoryId } = useSelector(selectDirectory);

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

  const { search } = useSelector(selectSearch)

    return (
      <StyledCard isToDirectory={toDirectoryId===directory.id} isDragging={isDragging} key={directory?.id} id={"directory-" + directory?.id} onClick={
        () => navigate(`/directories/${directory?.id || ''}`)
      }>
      {!search && directory.id && <DragIcon className="drag-handle" src={dragSrc} style={{width: "20px", height: "20px"}}/>}
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
    </StyledCard>
    )
}

const DragIcon = styled.img`
  &:hover {
    cursor: grab;
    background-color: #f2f2f2;
    border-radius: 5px;
  }
`;

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

const StyledCard = styled.div<{isDragging: boolean, isToDirectory?: boolean}>`
  display: flex;
  margin-bottom: 20px;
  width: 200px;
  align-items: center;
  flex-grow: 1;
  /* flex-direction: column; */
  background-color: ${(props) => (props.isDragging ? "#f2f2f2" : "white")};
  border: ${(props) => (props.isDragging ? "2px dashed #ccc" : "1px solid #ccc")};
  color: ${(props) => (props.isToDirectory ? "red" : "black")};
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
const AddNewDirectoryCard = styled(StyledCard)`
  flex-direction: column;
`