import { supabase } from './client';
import { DbProject, DbColumn, DbTask } from './types';

export async function createProject(project: Omit<DbProject, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getProjects(userId: string) {
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (projectsError) throw projectsError;

  const projectIds = projects.map(p => p.id);
  
  const { data: columns, error: columnsError } = await supabase
    .from('columns')
    .select('*')
    .in('project_id', projectIds)
    .order('position');

  if (columnsError) throw columnsError;

  const columnIds = columns.map(c => c.id);
  
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .in('column_id', columnIds)
    .order('position');

  if (tasksError) throw tasksError;

  return { projects, columns, tasks };
}