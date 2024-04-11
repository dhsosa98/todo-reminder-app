import { FC, useEffect, useRef, useState } from "react"
import { IDirectory } from "../../interfaces/Directory/IDirectory";
import { StyledDeleteButton, StyledEditButton, StyledH3 } from "../Common/Styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { deleteDirectoryById, selectDirectory, setDirectoriesEl, setEditableDirectory, setIsDragging, setIsOpenedModal, setToDirectoryId, updateDirectory } from "../../features/directorySlice";
import { ActionFromReducer } from "redux";
import { useDispatch } from "react-redux";
import NotFound from "../NotFound";
import { useSelector } from "react-redux";
import dragSrc from '/drag.svg';
import { ref } from "yup";
import { DNDPlugin, addEvents, animations, parents } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

type DirectoriesListProps = {
    directories: IDirectory[];
    handleAddItem: (type: 'directory' | 'task') => void;
    foldersContainerRef: React.RefObject<HTMLDivElement>;
}

const DirectoriesList: FC<DirectoriesListProps> = ({directories, handleAddItem, foldersContainerRef}) => {

    const {id} = useParams();

    const isHome = id === undefined;

  //   const [draggingId, setDraggingId] = useState<number | null>(null);

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

  //   const dragStatusPlugin: DNDPlugin = (parent) => {

  //     const parentData = parents.get(parent);
  //     if (!parentData) return;

  //     function dragstart(event: DragEvent) {
  //       dispatch(
  //         setToDirectoryId(null)
  //       );
  //       const node = event.target as HTMLElement;
  //       if (node.id === "no-drag") return;
  //       if (!node.classList.contains("drag-handle")) return;
  //       const prevElement = getPrevElement(node, parent);
  //       if (!prevElement) return;
  //       const id = Number(prevElement.getAttribute("id")?.split("-")[1]);
  //       setDraggingId(id);
  //       const dragImage = prevElement.cloneNode(true) as HTMLElement;
  //       dragImage.style.width = "200px";
  //       dragImage.className = "drag-image";
  //       document.body.appendChild(dragImage);
  //       event?.dataTransfer?.setDragImage(dragImage, 0, 0);
  //       document.body.style.cursor = "grabbing";
  //     }

  //     const touchstart = (event: TouchEvent) => {
  //       dispatch(
  //         setToDirectoryId(null)
  //       );
  //       const node = event.target as HTMLElement;
  //       if (node.id === "no-drag") return;
  //       if (!node.classList.contains("drag-handle")) return;
  //       const prevElement = getPrevElement(node, parent);
  //       if (!prevElement) return;
  //       const id = Number(prevElement.getAttribute("id")?.split("-")[1]);
  //       setDraggingId(id);
  //       document.body.style.cursor = "grabbing";
  //     }

  //     function dragend(event: DragEvent) {
  //       document.querySelectorAll(".drag-image").forEach((node) => {
  //         node.remove();
  //       });
  //       if (event?.dataTransfer?.dropEffect !== 'none') {          
  //         // handleEnd({e: event, targetData: parentData?.getValues(parent), parent});
  //       }
  //       dispatch(
  //         setToDirectoryId(null)
  //       );
  //       setDraggingId(null);
  //       document.body.style.cursor = "auto";
  //     }

  //     const touchend = (event: TouchEvent) => {
  //       // handleEnd({e: event, targetData: parentData?.getValues(parent), parent});
  //       setDraggingId(null);
  //       document.body.style.cursor = "auto";
  //     }

  //     return {
  //       setup() {},
  //       teardown() {},
  //       setupNode(data) {
  //         data.nodeData.abortControllers.customPlugin = addEvents(data.node, {
  //           dragstart: dragstart,
  //           dragend: dragend,
  //           touchstart: touchstart,
  //           touchend: touchend,
  //         });
  //       },
  //       tearDownNode(data) {
  //         if (data.nodeData?.abortControllers?.customPlugin) {
  //           data.nodeData?.abortControllers?.customPlugin.abort();
  //         }
  //       },
  //       setupNodeRemap() {},
  //       tearDownNodeRemap() {},
  //     };

  // };

  const makeACopy = (e: TouchEvent, targetData: any) => {
    const node = targetData.node.el;
    const dragImage = node.cloneNode(true) as HTMLElement;
    dragImage.classList.add("drag-image");
    dragImage.style.position = "absolute";
    dragImage.style.animation = 'none';
    dragImage.style.inlineSize = node.offsetWidth + "px";
    document.body.appendChild(dragImage);

    const rect = dragImage.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    dragImage.style.top = e.changedTouches[0].clientY + scrollTop - 40  + "px";
    dragImage.style.left = e.changedTouches[0].clientX + scrollLeft - 20  + "px";
    document.body.style.cursor = "grabbing";
  }

  const [ref, dirs, _setValues, updateConfig] = useDragAndDrop<HTMLDivElement, IDirectory>(directories, {
      group: "directories",
      sortable: false,
      dragHandle: ".drag-handle",
      draggable: (el) => {
        return el.id !== "no-drag";
      },  
      handleDragstart: ({e, targetData}) => {
        dispatch(
          setToDirectoryId(undefined)
        ); 
        const fromElem = document.elementFromPoint(e.clientX, e.clientY);
        if (!fromElem?.classList.contains("drag-handle")) {
          e.preventDefault();
          return;
        }
        dispatch(
          setIsDragging(true)
        )
        const node = targetData.node.el;
        const dragImage = node.cloneNode(true) as HTMLElement;
        node.style.opacity = "0.5";
        dragImage.style.inlineSize = node.offsetWidth + "px";
        dragImage.style.position = "fixed"
        dragImage.style.animation = 'none';
        dragImage.style.pointerEvents = "none";
        dragImage.style.zIndex = "9999";
        dragImage.style.top = -1000 + "px";
        dragImage.style.left = -1000 + "px";
        dragImage.classList.add("drag-image");
        document.body.appendChild(dragImage);
        e?.dataTransfer?.setDragImage(dragImage, 0, 0);
        document.body.style.cursor = "grabbing";
      },
      handleTouchstart: ({e, targetData}) => {
        const fromElem = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        if (!fromElem) return;
        if (!fromElem?.classList.contains("drag-handle")) {
          dispatch(
            setToDirectoryId(undefined)
          );
          return;
        }
        makeACopy(e, targetData);
        dispatch(
          setToDirectoryId(undefined)
        );
        dispatch(
          setIsDragging(true)
        )
      },
      handleTouchmove: ({e, targetData}) => {
        e.preventDefault();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        const dragImage = document.querySelector(".drag-image") as HTMLElement;
        if (!dragImage) return;

        dragImage.style.top = e.changedTouches[0].clientY + scrollTop - 40 + "px";
        dragImage.style.left = e.changedTouches[0].clientX + scrollLeft - 20 + "px";
        dragImage.style.pointerEvents = "none";

        const toElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        const el = getPrevElement(toElement as HTMLElement, targetData.parent.el);
        const toId = targetData.parent.data.enabledNodes.find((node) => node.el === el)?.data.value.id;
        if (toId === targetData.node.data.value.id) return;
        dispatch(
          setToDirectoryId(toId)
        );
      },
      handleDragoverNode({e, targetData}) {
        const toId = targetData.node.data.value.id;
        dispatch(
          setToDirectoryId(toId)
        );
      },
      handleEnd: ({e, targetData}) => {
        document.querySelectorAll(".drag-image").forEach((node) => {
          node.remove();
        });
        dispatch(
          setIsDragging(false)
        );
        dispatch(
          setToDirectoryId(undefined)
        );
        // if (e instanceof TouchEvent) {
        //   const fromElem = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        //   console.log({fromElem});
        //   if (!fromElem?.classList.contains("drag-handle")) {
        //     return;
        //   }
        // }
        let dropElement: Element | null = null;
        const parent = targetData.parent.el;
        if (e instanceof MouseEvent) {
          const isNone = e?.dataTransfer?.dropEffect === 'none'
          if (isNone) return;
        }
        if (e instanceof MouseEvent) {
          dropElement = document.elementFromPoint(e.clientX, e.clientY);
        } else if (e instanceof TouchEvent && e.changedTouches.length > 0) {
          dropElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
        const toElement = getPrevElement(dropElement as HTMLElement, parent);
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
          <AddNewDirectoryCard id="no-drag" isDragging={false} onClick={() => handleAddItem('directory')}>
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

    return (
      <StyledCard isToDirectory={toDirectoryId===directory.id} isDragging={isDragging} key={directory?.id} id={"directory-" + directory?.id} onClick={
        () => navigate(`/directories/${directory?.id || ''}`)
      }>
      {directory.id && <DragIcon className="drag-handle" src={dragSrc} style={{width: "20px", height: "20px"}}/>}
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