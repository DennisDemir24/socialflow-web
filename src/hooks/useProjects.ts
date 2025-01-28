import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useAuth } from '@/hooks/useAuth';

export function useProjects() {
  const store = useProjectStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      store.initializeProjects(user.id);
    }
  }, [user]);

  return {
    projects: store.projects,
    isLoading: store.isLoading,
    error: store.error,
    activeProject: store.activeProject,
    addProject: store.addProject,
    updateProject: store.updateProject,
    removeProject: store.removeProject,
    setActiveProject: store.setActiveProject,
    addTask: store.addTask,
    moveTask: store.moveTask,
    updateTask: store.updateTask,
    removeTask: store.removeTask,
  };
}
