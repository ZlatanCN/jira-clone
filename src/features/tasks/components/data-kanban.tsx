import React, { useState, useCallback, useEffect } from "react"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import { Task, TaskStatus } from "../types"

import { KanbanColumnHeader } from "@/features/tasks/components/kanban-column-header"

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
]

type TasksState = {
  [key in TaskStatus]: Task[]
}

interface DataKanbanProps {
  data: Task[]
}

export const DataKanban = ({ data }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;

  }, [])
  return (
    <DragDropContext onDragEnd={() => { }}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div key={board} className="flex-1 mx-2 bg-muted rounded-lg p-1.5 rounded-md min-w-[200px]">
              <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
