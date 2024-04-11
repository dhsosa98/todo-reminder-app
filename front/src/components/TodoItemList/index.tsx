import React, { FC, useCallback, useEffect, useState } from "react";
import NotFound from "../NotFound";
import TodoItem from "../TodoItem";
import { ITodoItem } from "../../interfaces/TodoItem/ITodoItem";
import { updateSelected, updateTodoItemById, updateTodoItemOrder } from "../../features/todoItemsSlice";
import { useDispatch } from "react-redux";
import { ActionFromReducer } from "redux";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { DNDPlugin, addEvents, animations, parents } from "@formkit/drag-and-drop";
import styled from "styled-components";
import { selectDirectory, setIsDragging, updateTodoItem, updateTodoItems } from "../../features/directorySlice";
import { todoItemService } from "../../services/TodoItem";
import { useSelector } from "react-redux";


type TodoItemListProps = {
    todoList: ITodoItem[];
    handleAddItem: (type: 'directory' | 'task') => void;
    foldersContainerRef?: React.RefObject<HTMLDivElement>;
}


const TodoItemList: FC<TodoItemListProps> = ({todoList, handleAddItem, foldersContainerRef}) => {

    const [draggingId, setDraggingId] = useState<number | null>(null);

    useEffect(() => {
      dispatch(setIsDragging(!!draggingId));
    },[draggingId]);


    const taskLefts = todoList?.filter((todo) => !todo.selected);

    const taskCompleted = todoList?.filter((todo) => todo.selected);

    const dispatch = useDispatch();

    const dragover = (event: DragEvent) => {
      const { clientY } = event;
      const { innerHeight } = window;

      if (clientY < 200) {
        // Scroll up
        window.scrollBy(0, clientY * -0.07);
      } else if (clientY > innerHeight - 200) {
        // Scroll down
        window.scrollBy(0, (clientY - innerHeight) * 0.07);
      } 
    };

    const touchmove = (event: TouchEvent) => {
      const { clientY } = event.changedTouches[0];
      const { innerHeight } = window;

      if (clientY < 180) {
        // Scroll up
          window.scrollBy(0, -3);
      } else if (clientY > innerHeight - 180) {
        // Scroll down
          window.scrollBy(0, 3);
      } 
    }

    useEffect(() => {
      window.addEventListener('dragover', dragover);
      window.addEventListener('touchmove', touchmove);
      return () => {
        window.removeEventListener('dragover', dragover);
        window.removeEventListener('touchmove', touchmove);
      }
    }, []);

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

    const dragStatusPlugin: DNDPlugin = (parent) => {

      const parentData = parents.get(parent);
      if (!parentData) return;

      function dragstart(event: DragEvent) {
        const node = event.target as HTMLElement;
        if (node.id === "no-drag") return;
        if (!node.classList.contains("drag-handle")) return;
        const prevElement = getPrevElement(node, parent);
        if (!prevElement) return;
        const id = Number(prevElement.getAttribute("id")?.split("-")[1]);
        setDraggingId(id);
        const dragImage = prevElement.cloneNode(true) as HTMLElement;
        dragImage.style.width = "200px";
        dragImage.className = "drag-image";
        document.body.appendChild(dragImage);
        event?.dataTransfer?.setDragImage(dragImage, 0, 0);
        document.body.style.cursor = "grabbing";
      }

      const touchstart = (event: TouchEvent) => {
        const node = event.target as HTMLElement;
        if (node.id === "no-drag") return;
        if (!node.classList.contains("drag-handle")) return;
        const prevElement = getPrevElement(node, parent);
        if (!prevElement) return;
        const id = Number(prevElement.getAttribute("id")?.split("-")[1]);
        setDraggingId(id);
        document.body.style.cursor = "grabbing";
      }

      function dragend(event: DragEvent) {
        document.querySelectorAll(".drag-image").forEach((node) => {
          node.remove();
        });
        handleEnd({e: event, targetData: parentData?.getValues(parent), parent});
        setDraggingId(null);
        document.body.style.cursor = "auto";
      }

      const touchend = (event: TouchEvent) => {
        handleEnd({e: event, targetData: parentData?.getValues(parent), parent});
        setDraggingId(null);
        document.body.style.cursor = "auto";
      }

      return {
        setup() {},
        teardown() {},
        setupNode(data) {
          data.nodeData.abortControllers.customPlugin = addEvents(data.node, {
            dragstart: dragstart,
            dragend: dragend,
            touchstart: touchstart,
            touchend: touchend,
          });
        },
        tearDownNode(data) {
          if (data.nodeData?.abortControllers?.customPlugin) {
            data.nodeData?.abortControllers?.customPlugin.abort();
          }
        },
        setupNodeRemap() {},
        tearDownNodeRemap() {},
      };
  };

  const handleEnd = ({e, targetData, parent}: {e: MouseEvent | TouchEvent, targetData: any, parent: Element}) => {
    const elements = targetData as ITodoItem[];
    const sortedTodos = elements.map((todo, index) => {
      return {
        ...todo,
        order: index
      }
    });
    let dropElement: Element | null = null;
    if (e instanceof MouseEvent) {
      dropElement = document.elementFromPoint(e.clientX, e.clientY);
    } else if (e instanceof TouchEvent && e.changedTouches.length > 0) {
      dropElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
    const prevElement = getPrevElement(dropElement as HTMLElement, foldersContainerRef?.current!);
    const node = e.target as HTMLElement;
    const prevElement2 = getPrevElement(node, parent);
    if (!prevElement2) return;
    const id = Number(prevElement2.getAttribute("id")?.split("-")[1]);
    if (prevElement && id) {
      const newDirectoryId = Number(prevElement?.getAttribute("id")?.split("-")[1]);
      const todoItem = todoList.find((todo) => todo.id === id)!;
      dispatch(
        updateTodoItem({
          ...todoItem,
          directoryId: newDirectoryId
        }) as ActionFromReducer<ITodoItem>
      );
      todoItemService.updateTodoItem(id, {
        directoryId: newDirectoryId
      } as ITodoItem);
    }
    handleSort(sortedTodos)
  }


    const [parentDone, doneTodos, _setValuesDone, updateConfigDone] = useDragAndDrop<HTMLDivElement, ITodoItem>(taskCompleted, {
      group: "doneTodos",
      sortable: true,
      dragHandle: ".drag-handle",
      draggable: (el) => {
        return el.id !== "no-drag";
      },  
      plugins: [
        animations(),
        dragStatusPlugin
      ]
    })

    const [parentLeft, leftTodos, _setValuesLeft, updateConfigLeft] = useDragAndDrop<HTMLDivElement, ITodoItem>(taskLefts, {
      group: "leftTodos",
      sortable: true,
      dragHandle: ".drag-handle",
      draggable: (el) => {
        return el.id !== "no-drag";
      },  
      plugins: [
        animations(),
        dragStatusPlugin
      ]
    })

    useEffect(() => {
      _setValuesLeft(taskLefts);
    }, [taskLefts.length]);

    useEffect(() => {
      _setValuesDone(taskCompleted);
    }, [taskCompleted.length]);


    const handleSort = useCallback((todos: ITodoItem[]) => {
        // dispatch(
        //   updateTodoItemOrder(todos) as ActionFromReducer<ITodoItem[]>
        // )
    },[]);

    return (
      <ListContainer>
        {/* {todos?.length === 0 && (
            <NotFound title="To-do List" text="Add one with button below" />
        )} */}
        {!!todoList?.length ? (
          <h2>Tasks Left</h2>
        ) : (
          <h2>Tasks</h2>
        )}
        <TodosContainer ref={parentLeft}>
          <StyledCard onClick={() => handleAddItem('task')} id="no-drag">
              <i className="fi fi-rr-add" style={{marginRight: "4px", textDecoration: "none"}}></i>
              <p>Add a new task</p>
          </StyledCard>
          {leftTodos?.map((item) => (
            <React.Fragment key={item.id}>
              <TodoItem item={item} draggingId={draggingId} groupIds={leftTodos.map(t=>t.id)}/>
            </React.Fragment>
          ))}
        </TodosContainer>
        {doneTodos?.length > 0 && (
        <>
          <h2>Tasks Done</h2>
          <TodosContainer ref={parentDone}>
            {doneTodos?.map((item) => (
              <React.Fragment key={item.id}>
                <TodoItem item={item} draggingId={draggingId} groupIds={doneTodos.map(t=>t.id)} />
              </React.Fragment>
            ))}
          </TodosContainer>
        </>
        )}
      </ListContainer>
    )
}

export default TodoItemList;

const StyledCard = styled.div`
  margin-bottom: 20px;
  flex: 1;
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 10px;
  min-width: 200px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);  
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  text-align: left;
`;

const TodosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  text-align: left;
  width: 100%;
  gap: 10px;
`;