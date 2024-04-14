import { useEffect, useState } from "react";
import { directoryService } from "../../services/directories";
import { IDirectory } from "../../interfaces/Directory/IDirectory";
import { useNavigate } from "react-router-dom";
import { todoItemService } from "../../services/TodoItem";


const TreeItem = ({directory, level, onDragEnter, onDragStart, onDragEnd}: {directory: IDirectory, level?: number, onDragEnter: any, onDragStart: any, onDragEnd: any}) => {
    level = level || 0;
    const nextLevel = level + 1;
    const navigate = useNavigate();

    return (
        <div style={{marginLeft: `${level * 20}px`, minWidth: '500px'}}>
            <button onClick={() => navigate(`/directories/${directory.id}`)}>
                <h1>{directory.name}</h1>
            </button>
                {directory.children?.map((child) => (
                    <TreeItem key={child.id} directory={child} level={nextLevel}
                    onDragStart={onDragStart}
                    onDragEnter={onDragEnter}
                    onDragEnd= {onDragEnd}
                    />
                ))}
                {directory.todoItem?.map((todo) => (
                    <p 
                    draggable
                    onDragStart={(e) => onDragStart(e, todo.id)}
                    onDragEnter={(e) => onDragEnter(e, todo.directoryId)}
                    onDragEnd={(e) => onDragEnd(e)}
                    style={{marginLeft: `${(nextLevel) * 20}px`}}
                    onClick={() => navigate(`/todoItem/${todo.id}`)} 
                    key={todo.id}>{todo.description}</p>
                ))}
        </div>
    )
}


const FullTree = () => {
    const [directories, setDirectories] = useState<IDirectory[]>([]);
    const fetchFullTree = async () => {
        const {data} = await directoryService.getFullTree();
        setDirectories(data);
    }
    useEffect(() => {
        fetchFullTree()
    },[])

    const [startId, setStartId] = useState<number | null>(null);
    const [endId, setEndId] = useState<number | null>(null);

    const onDragStart = (e: React.DragEvent<HTMLParagraphElement>, id: number) => {
        setStartId(id);
    }
    const onDragEnter = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        e.preventDefault();
        setEndId(id);
    }

    const onDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (startId && endId) {
            const {data} = await todoItemService.updateTodoItem(startId, {
                directoryId: endId
            } as any)
        }
    }

    return (
        <>
        {directories.map((directory) => (
            <TreeItem 
            key={directory.id} directory={directory}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd= {onDragEnd}
            />
        ))}
        </>
    )
}

export default FullTree;