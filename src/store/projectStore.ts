import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: string;
  name: string;
  description?: string;
  icon: 'design' | 'code' | 'docs' | 'video';
  isActive?: boolean;
}

interface ProjectState {
  projects: Project[];
  activeProject: string | null;
  addProject: (project: Omit<Project, 'id'>) => void;
  setActiveProject: (id: string) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [
    { id: '1', name: 'Design and Prototype', icon: 'design' },
    { id: '2', name: 'Documentation', icon: 'docs' },
    { id: '3', name: 'Prepare Courses', icon: 'video' },
    { id: '4', name: 'Coding and Development', icon: 'code' },
  ],
  activeProject: null,

  addProject: (projectData) => set((state) => ({
    projects: [...state.projects, { ...projectData, id: uuidv4() }]
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
  }))
}));