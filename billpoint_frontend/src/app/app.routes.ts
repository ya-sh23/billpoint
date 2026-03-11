import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing/landing.component').then(m => m.LandingComponent) },
  // Lazy load components that we will create soon
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  
  { 
    path: 'admin', 
    canActivate: [AuthGuard], 
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  
  { 
    path: 'shop-owner', 
    canActivate: [AuthGuard], 
    data: { roles: ['SHOP_OWNER'] },
    loadComponent: () => import('./features/shop-owner/owner-dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent)
  },
  
  { 
    path: 'staff', 
    canActivate: [AuthGuard], 
    data: { roles: ['STAFF'] },
    loadComponent: () => import('./features/staff/staff-dashboard/staff-dashboard.component').then(m => m.StaffDashboardComponent)
  },

  { 
    path: 'customer', 
    canActivate: [AuthGuard], 
    data: { roles: ['CUSTOMER'] },
    loadComponent: () => import('./features/customer/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent)
  },

  { path: '**', redirectTo: '/login' }
];
