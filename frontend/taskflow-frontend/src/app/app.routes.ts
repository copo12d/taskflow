import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TaskListComponent } from './components/task-list/task-list';
import { TaskDetailComponent } from './components/task-detail/task-detail';
import { AdminPanelComponent } from './components/admin-panel/admin-panel';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tasks', 
    component: TaskListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tasks/:id', 
    component: TaskDetailComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin', 
    component: AdminPanelComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  { path: '**', redirectTo: '/login' }
];
