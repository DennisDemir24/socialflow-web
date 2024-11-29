import { Card } from "@/components/ui/card";
import { MoreVertical, MessageSquare, Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useProjectStore, Task, Column } from "@/store/projectStore";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { CreateTaskDialog } from "./CreateTaskDialog";

interface DragItem {
  type: 'TASK';
  id: string;
  columnId: string;
}

interface TaskCardProps {
  task: Task;
  columnId: string;
  onEdit?: (task: Task) => void;
}

const TaskCard = ({ task, columnId, onEdit }: TaskCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { type: 'TASK', id: task.id, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card 
        className="bg-[#141517] border-[#2A2B31] overflow-hidden hover:border-[#5B5FED] transition-colors cursor-move"
        onClick={() => onEdit?.(task)}
      >
        {task.image && (
          <div className="relative">
            <Image 
              src={task.image} 
              width={100}
              height={100}
              alt="" 
              className="w-full h-32 object-cover"
            />
            <Badge 
              className={`absolute top-2 left-2 ${task.tag.color}`}
            >
              {task.tag.name}
            </Badge>
          </div>
        )}
        <div className="p-4">
          <h4 className="font-medium mb-2 text-white">{task.title}</h4>
          <p className="text-sm text-gray-400 mb-4">{task.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">{task.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs">{task.timeEstimate}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface ColumnProps {
  column: Column;
  projectId: string;
  onCreateTask: (columnId: string) => void;
  onEditTask: (task: Task, columnId: string) => void;
  onMoveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
}

const ColumnComponent = ({ column, projectId, onCreateTask, onEditTask, onMoveTask }: ColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: DragItem) => {
      if (item.columnId !== column.id) {
        onMoveTask(item.id, item.columnId, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [column.id, onMoveTask]);

  return (
    <div 
      ref={drop}
      className={`w-80 ${isOver ? 'bg-[#1A1C22]' : ''} rounded-lg p-2`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-medium text-sm text-white">{column.title}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[#2A2B31] text-gray-400"
          onClick={() => onCreateTask(column.id)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            onEdit={(task) => onEditTask(task, column.id)}
          />
        ))}
      </div>
    </div>
  );
};

export function KanbanBoard() {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const activeProjectId = useProjectStore(state => state.activeProject);
  const projects = useProjectStore(state => state.projects);
  const moveTask = useProjectStore(state => state.moveTask);
  const addTask = useProjectStore(state => state.addTask);
  const updateTask = useProjectStore(state => state.updateTask);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const handleCreateTask = useCallback((columnId: string) => {
    setSelectedColumnId(columnId);
    setIsCreateTaskOpen(true);
  }, []);

  const handleTaskSubmit = useCallback((taskData: Omit<Task, 'id'>) => {
    if (activeProject && selectedColumnId) {
      addTask(activeProject.id, selectedColumnId, taskData);
      setIsCreateTaskOpen(false);
      setSelectedColumnId(null);
    }
  }, [activeProject, selectedColumnId, addTask]);

  const handleEditTask = useCallback((task: Task, columnId: string) => {
    setSelectedTask(task);
    setSelectedColumnId(columnId);
    setIsCreateTaskOpen(true);
  }, []);

  const handleTaskUpdate = useCallback((taskData: Omit<Task, 'id'>) => {
    if (activeProject && selectedColumnId && selectedTask) {
      updateTask(activeProject.id, selectedColumnId, selectedTask.id, taskData);
      setIsCreateTaskOpen(false);
      setSelectedColumnId(null);
      setSelectedTask(null);
    }
  }, [activeProject, selectedColumnId, selectedTask, updateTask]);

  const handleMoveTask = useCallback((taskId: string, fromColumnId: string, toColumnId: string) => {
    if (activeProject) {
      moveTask(activeProject.id, taskId, fromColumnId, toColumnId);
    }
  }, [activeProject, moveTask]);

  if (!activeProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a project to view its Kanban board
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full overflow-x-auto">
        <div className="flex gap-6 p-6 min-w-max">
          {activeProject.board.columns.map((column) => (
            <ColumnComponent
              key={column.id}
              column={column}
              projectId={activeProject.id}
              onCreateTask={handleCreateTask}
              onEditTask={handleEditTask}
              onMoveTask={handleMoveTask}
            />
          ))}
        </div>
      </div>

      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        onSubmit={selectedTask ? handleTaskUpdate : handleTaskSubmit}
        task={selectedTask}
      />
    </DndProvider>
  );
}