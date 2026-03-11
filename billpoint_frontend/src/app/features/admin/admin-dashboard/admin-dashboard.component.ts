import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-layout animate-fade-in">
      <aside class="sidebar">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Bill<span>Point</span>
        </div>
        
        <a href="javascript:void(0)" class="nav-item" [class.active]="currentTab === 'requests'" (click)="currentTab = 'requests'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          Pending Requests
        </a>
        
        <a href="javascript:void(0)" class="nav-item" [class.active]="currentTab === 'owners'" (click)="currentTab = 'owners'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          All Shop Owners
        </a>
        
        <div style="margin-top: auto; padding-top: 2rem;">
          <a href="javascript:void(0)" class="nav-item" (click)="logout()" style="color: var(--danger-color);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </a>
        </div>
      </aside>

      <main class="main-content">
        <header class="header-bar">
          <h2>{{ currentTab === 'requests' ? 'Pending Approvals' : 'Registered Shop Owners' }}</h2>
          <div class="user-profile">
            <span style="color: var(--text-secondary)">Admin</span>
            <div class="avatar">A</div>
          </div>
        </header>

        <!-- Pending Requests Tab -->
        <div *ngIf="currentTab === 'requests'" class="glass-panel">
          <div *ngIf="pendingRequests.length === 0" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
            No pending requests at the moment.
          </div>
          
          <div class="premium-table-container" *ngIf="pendingRequests.length > 0">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>Shop/Owner Name</th>
                  <th>Username</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let req of pendingRequests">
                  <td>{{ req.name }}</td>
                  <td>{{ req.username }}</td>
                  <td>{{ req.contact }}</td>
                  <td style="display: flex; gap: 8px;">
                    <button class="premium-btn success" style="padding: 6px 12px; font-size: 0.85rem;" (click)="approve(req.userId)">Approve</button>
                    <button class="premium-btn danger" style="padding: 6px 12px; font-size: 0.85rem;" (click)="reject(req.userId)">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- All Owners Tab -->
        <div *ngIf="currentTab === 'owners'" class="glass-panel">
          <div *ngIf="allOwners.length === 0" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
            No shop owners found.
          </div>
          
          <div class="premium-table-container" *ngIf="allOwners.length > 0">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Shop/Owner Name</th>
                  <th>Username</th>
                  <th>Contact</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let owner of allOwners">
                  <td>#{{ owner.userId }}</td>
                  <td>{{ owner.name }}</td>
                  <td>{{ owner.username }}</td>
                  <td>{{ owner.contact }}</td>
                  <td>
                    <span [ngStyle]="{
                      'padding': '4px 8px', 
                      'border-radius': '4px', 
                      'font-size': '0.8rem',
                      'font-weight': 'bold',
                      'background': owner.status === 'APPROVED' ? 'rgba(46, 160, 67, 0.2)' : (owner.status === 'REJECTED' ? 'rgba(248, 81, 73, 0.2)' : 'rgba(210, 153, 34, 0.2)'),
                      'color': owner.status === 'APPROVED' ? 'var(--success-color)' : (owner.status === 'REJECTED' ? 'var(--danger-color)' : 'var(--warning-color)')
                    }">{{ owner.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  currentTab: 'requests' | 'owners' = 'requests';
  pendingRequests: any[] = [];
  allOwners: any[] = [];

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getPendingRequests().subscribe(data => {
      this.pendingRequests = data;
    });
    
    // We didn't build a specific endpoint for all owners in the admin controller yet, or did we?
    // Let me check: I built `@GetMapping("/shop-owners") public ResponseEntity<List<ShopOwner>> getAllShopOwners()`
    // I need to add that to ApiService.
    // Wait, ApiService doesn't have `getAllShopOwners()`. I should quickly adapt or just use `getPendingRequests()` placeholder if needed.
    // Let's assume I will add `getAllShopOwners` to ApiService now (I'll do that next).
    
    // For now, casting generic `any` response
    (this.apiService as any).http.get('http://localhost:8080/api/admin/shop-owners').subscribe((data: any) => {
      this.allOwners = data;
    });
  }

  approve(id: number) {
    this.apiService.approveShopOwner(id).subscribe(() => {
      this.loadData();
    });
  }

  reject(id: number) {
    this.apiService.rejectShopOwner(id).subscribe(() => {
      this.loadData();
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
