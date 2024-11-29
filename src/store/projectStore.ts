import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description: string;
  image?: string;
  tag: {
    name: string;
    color: string;
  };
  assignees: string[];
  comments: number;
  timeEstimate: number;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  icon: 'design' | 'code' | 'docs' | 'video';
  isActive?: boolean;
  board: {
    columns: Column[];
  };
}

interface ProjectState {
  projects: Project[];
  activeProject: string | null;
  addProject: (project: Omit<Project, 'id' | 'board'>) => void;
  setActiveProject: (id: string) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  addTask: (projectId: string, columnId: string, task: Omit<Task, 'id'>) => void;
  moveTask: (projectId: string, taskId: string, fromColumnId: string, toColumnId: string) => void;
  updateTask: (projectId: string, columnId: string, taskId: string, updates: Partial<Task>) => void;
  removeTask: (projectId: string, columnId: string, taskId: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  activeProject: null,

  addProject: (projectData) => set((state) => ({
    projects: [...state.projects, { 
      ...projectData, 
      id: uuidv4(),
      isActive: state.projects.length === 0, 
      board: {
        columns: [
          {
            id: 'todo',
            title: 'To-Do',
            color: '#FF4A4A',
            tasks: []
          },
          {
            id: 'in-progress',
            title: 'In Progress',
            color: '#3E7BFA',
            tasks: []
          },
          {
            id: 'review',
            title: 'To be Review',
            color: '#5B5FED',
            tasks: []
          },
          {
            id: 'done',
            title: 'Done',
            color: '#00B884',
            tasks: []
          }
        ]
      }
    }],
    activeProject: state.projects.length === 0 ? uuidv4() : state.activeProject
  })),

  setActiveProject: (id) => set((state) => ({
    projects: state.projects.map(project => ({
      ...project,
      isActive: project.id === id
    })),
    activeProject: id
  })),

  removeProject: (id) => set((state) => ({
    projects: state.projects.filter(project => project.id !== id)
  })),

  updateProject: (id, projectData) => set((state) => ({
    projects: state.projects.map(project => 
      project.id === id ? { ...project, ...projectData } : project
    )
  })),

  addTask: (projectId, columnId, taskData) => set((state) => ({
    projects: state.projects.map(project => {
      if (project.id !== projectId) return project;
      return {
        ...project,
        board: {
          ...project.board,
          columns: project.board.columns.map(column => {
            if (column.id !== columnId) return column;
            return {
              ...column,
              tasks: [...column.tasks, { ...taskData, id: uuidv4() }]
            };
          })
        }
      };
    })
  })),

  moveTask: (projectId, taskId, fromColumnId, toColumnId) => set((state) => ({
    projects: state.projects.map(project => {
      if (project.id !== projectId) return project;

      const task = project.board.columns
        .find(col => col.id === fromColumnId)
        ?.tasks.find(t => t.id === taskId);

      if (!task) return project;

      return {
        ...project,
        board: {
          ...project.board,
          columns: project.board.columns.map(column => {
            if (column.id === fromColumnId) {
              return {
                ...column,
                tasks: column.tasks.filter(t => t.id !== taskId)
              };
            }
            if (column.id === toColumnId) {
              return {
                ...column,
                tasks: [...column.tasks, task]
              };
            }
            return column;
          })
        }
      };
    })
  })),

  updateTask: (projectId, columnId, taskId, updates) => set((state) => ({
    projects: state.projects.map(project => {
      if (project.id !== projectId) return project;
      return {
        ...project,
        board: {
          ...project.board,
          columns: project.board.columns.map(column => {
            if (column.id !== columnId) return column;
            return {
              ...column,
              tasks: column.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
              )
            };
          })
        }
      };
    })
  })),

  removeTask: (projectId, columnId, taskId) => set((state) => ({
    projects: state.projects.map(project => {
      if (project.id !== projectId) return project;
      return {
        ...project,
        board: {
          ...project.board,
          columns: project.board.columns.map(column => {
            if (column.id !== columnId) return column;
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== taskId)
            };
          })
        }
      };
    })
  }))
}));