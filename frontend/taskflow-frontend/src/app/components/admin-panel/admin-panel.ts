import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { Task, CreateTaskRequest } from '../../models/task.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanelComponent implements OnInit {
  currentUser: User | null = null;
  allTasks: Task[] = [];
  allUsers: User[] = [];
  loading = true;
  error = '';
  
  // Stats
  stats = {
    totalTasks: 0,
    totalUsers: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0
  };
  
  // Quick create task
  showQuickCreate = false;
  quickTask: CreateTaskRequest = {
    title: '',
    description: '',
    priority: 'medium'
  };

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    
    // Cargar tareas primero
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks || [];
        
        // Luego cargar usuarios
        this.userService.getAllUsers().subscribe({
          next: (users) => {
            this.allUsers = users || [];
            this.calculateStats();
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Error al cargar los usuarios';
            this.loading = false;
            console.error('Error loading users:', error);
          }
        });
      },
      error: (error) => {
        this.error = 'Error al cargar las tareas';
        this.loading = false;
        console.error('Error loading tasks:', error);
      }
    });
  }

  calculateStats(): void {
    this.stats.totalTasks = this.allTasks.length;
    this.stats.totalUsers = this.allUsers.length;
    this.stats.completedTasks = this.allTasks.filter(t => t.status === 'completed').length;
    this.stats.pendingTasks = this.allTasks.filter(t => t.status === 'pending').length;
    this.stats.inProgressTasks = this.allTasks.filter(t => t.status === 'in_progress').length;
  }

  // Quick actions
  goToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  createQuickTask(): void {
    if (!this.quickTask.title || !this.quickTask.description) {
      return;
    }

    this.taskService.createTask(this.quickTask).subscribe({
      next: (task) => {
        this.allTasks.push(task);
        this.calculateStats();
        this.resetQuickCreate();
      },
      error: (error) => {
        this.error = 'Error al crear la tarea';
        console.error('Error creating quick task:', error);
      }
    });
  }

  resetQuickCreate(): void {
    this.showQuickCreate = false;
    this.quickTask = {
      title: '',
      description: '',
      priority: 'medium'
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
