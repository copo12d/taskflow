import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { Task, CreateTaskRequest, AssignTaskRequest, UpdateTaskStatusRequest } from '../../models/task.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskListComponent implements OnInit, OnDestroy {
  private fragmentSub?: any;
  tasks: Task[] = [];
  users: User[] = [];
  currentUser: User | null = null;
  isAdminUser: boolean = false;
  loading = true;
  error = '';

  // Para crear nueva tarea (solo admin)
  showCreateForm = false;
  newTask: any = {
    title: '',
    description: '',
    priority: 'medium',
    userId: null
  };

  // Para editar tarea
  editingTask: Task | null = null;
  
  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.authService.getCurrentUser();
      this.isAdminUser = this.currentUser?.role === 'admin';
      console.log('🔍 TaskList - Usuario actual:', this.currentUser);
      console.log('🔍 TaskList - Es admin?', this.isAdminUser);
      this.loadTasks();
      if (this.isAdminUser) {
        console.log('✅ TaskList - Cargando usuarios porque es admin');
        this.loadUsers();
      } else {
        console.log('❌ TaskList - No cargando usuarios porque no es admin');
      }
      // Guardar la suscripción para desuscribir después
      this.fragmentSub = this.route.fragment.subscribe(fragment => {
        if (fragment === 'create' && this.isAdminUser) {
          this.showCreateForm = true;
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.fragmentSub) {
      this.fragmentSub.unsubscribe();
    }
  }

  loadTasks(): void {
    this.loading = true;
    const taskObservable = this.isAdmin() 
      ? this.taskService.getAllTasks() 
      : this.taskService.getMyTasks();
    
    taskObservable.subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las tareas';
        this.loading = false;
        console.error('Error loading tasks:', error);
      }
    });
  }

  loadUsers(): void {
    console.log('🔍 TaskList - Iniciando carga de usuarios...');
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('✅ TaskList - Usuarios cargados:', users);
        this.users = users;
        console.log('📈 TaskList - Total usuarios:', this.users.length);
      },
      error: (error) => {
        console.error('❌ TaskList - Error loading users:', error);
        console.error('🚨 TaskList - Detalles del error:', error.message, error.status);
      }
    });
  }

  isAdmin(): boolean {
    return this.isAdminUser;
  }

  // Crear nueva tarea
  createTask(): void {
    if (!this.newTask.title || !this.newTask.description) {
      return;
    }
    const payload: any = {
      title: this.newTask.title,
      description: this.newTask.description,
      priority: this.newTask.priority
    };
    if (this.newTask.userId) {
      payload.userId = this.newTask.userId;
    }
    this.taskService.createTask(payload).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.resetCreateForm();
      },
      error: (error) => {
        this.error = 'Error al crear la tarea';
        console.error('Error creating task:', error);
      }
    });
  }

  // Eliminar tarea
  deleteTask(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== id);
        },
        error: (error) => {
          this.error = 'Error al eliminar la tarea';
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  // Manejar evento de asignación
  onAssignTask(taskId: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const userId = parseInt(target.value);
    if (userId) {
      this.assignTask(taskId, userId);
    }
  }

  // Asignar tarea a usuario
  assignTask(taskId: number, userId: number): void {
    const assignData: AssignTaskRequest = { userId };
    
    this.taskService.assignTask(taskId, assignData).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      },
      error: (error) => {
        this.error = 'Error al asignar la tarea';
        console.error('Error assigning task:', error);
      }
    });
  }

  // Cambiar estado de tarea
  updateTaskStatus(taskId: number, status: 'pending' | 'in_progress' | 'completed'): void {
    const statusData: UpdateTaskStatusRequest = { status };
    
    this.taskService.updateTaskStatus(taskId, statusData).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      },
      error: (error) => {
        this.error = 'Error al actualizar el estado';
        console.error('Error updating task status:', error);
      }
    });
  }

  // Iniciar edición
  startEdit(task: Task): void {
    this.editingTask = { ...task };
  }

  // Cancelar edición
  cancelEdit(): void {
    this.editingTask = null;
  }

  // Guardar edición
  saveEdit(): void {
    if (!this.editingTask) return;

    const updateData = {
      title: this.editingTask.title,
      description: this.editingTask.description,
      priority: this.editingTask.priority
    };

    this.taskService.updateTask(this.editingTask.id, updateData).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(task => task.id === this.editingTask!.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.editingTask = null;
      },
      error: (error) => {
        this.error = 'Error al actualizar la tarea';
        console.error('Error updating task:', error);
      }
    });
  }

  // Resetear formulario de crear
  resetCreateForm(): void {
    this.showCreateForm = false;
    this.newTask = {
      title: '',
      description: '',
      priority: 'medium'
    };
  }

  // Obtener clase CSS para prioridad
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  // Obtener clase CSS para estado
  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in_progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }

  // Navegar al dashboard
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  // Logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
