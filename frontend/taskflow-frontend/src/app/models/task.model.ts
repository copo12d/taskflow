export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: number;
  assignedUser?: {
    id: number;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface AssignTaskRequest {
  userId: number;
}

export interface UpdateTaskStatusRequest {
  status: 'pending' | 'in_progress' | 'completed';
}
