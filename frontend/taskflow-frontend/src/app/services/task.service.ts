import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  AssignTaskRequest, 
  UpdateTaskStatusRequest 
} from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  // Obtener todas las tareas
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API_URL);
  }

  // Obtener tareas asignadas al usuario actual
  getMyTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/my`);
  }

  // Crear nueva tarea (solo admin)
  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.API_URL, taskData);
  }

  // Actualizar tarea (solo admin)
  updateTask(id: number, taskData: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, taskData);
  }

  // Eliminar tarea (solo admin)
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Asignar tarea a usuario (solo admin)
  assignTask(id: number, assignData: AssignTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/${id}/assign`, assignData);
  }

  // Actualizar estado de tarea
  updateTaskStatus(id: number, statusData: UpdateTaskStatusRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.API_URL}/${id}/status`, statusData);
  }
}
