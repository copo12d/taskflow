import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  myTasks: Task[] = [];
  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user in dashboard:', this.currentUser);
    console.log('Is admin?', this.currentUser?.role === 'admin');
    this.loadMyTasks();
  }

  loadMyTasks(): void {
    const taskObservable = this.currentUser?.role === 'admin' 
      ? this.taskService.getAllTasks() 
      : this.taskService.getMyTasks();
    
    taskObservable.subscribe({
      next: (tasks) => {
        this.myTasks = tasks;
        this.loading = false;
      },
      error: (error) => {
        this.error = this.currentUser?.role === 'admin' 
          ? 'Error al cargar todas las tareas' 
          : 'Error al cargar tus tareas';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  goToCreateTask(): void {
    this.router.navigate(['/tasks'], { fragment: 'create' });
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  getTasksByStatus(status: string): Task[] {
    return this.myTasks.filter(task => task.status === status);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in_progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }
}
