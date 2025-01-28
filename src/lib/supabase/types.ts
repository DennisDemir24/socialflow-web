export interface DbProject {
    id: string;
    name: string;
    description?: string;
    icon: 'design' | 'code' | 'docs' | 'video';
    is_active: boolean;
    user_id: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface DbColumn {
    id: string;
    project_id: string;
    title: string;
    color: string;
    position: number;
    created_at: string;
  }
  
  export interface DbTask {
    id: string;
    column_id: string;
    title: string;
    description?: string;
    image?: string;
    tag_name?: string;
    tag_color?: string;
    assignees: string[];
    comments: number;
    time_estimate?: number;
    position: number;
    created_at: string;
    updated_at: string;
  }