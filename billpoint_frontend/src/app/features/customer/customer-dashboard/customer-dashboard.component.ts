import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-layout animate-fade-in">
      <aside class="sidebar">
        <div class="logo">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Bill<span>Point</span>
        </div>
        
        <a href="javascript:void(0)" class="nav-item active">
          Billing History
        </a>
        
        <div style="margin-top: auto; padding-top: 2rem;">
          <a href="javascript:void(0)" class="nav-item" (click)="logout()" style="color: var(--danger-color);">
            Logout
          </a>
        </div>
      </aside>

      <main class="main-content">
        <header class="header-bar">
          <h2>My Order History</h2>
          <div class="user-profile">
            <span style="color: var(--text-secondary)">{{ authService.currentUserValue?.username }}</span>
            <div class="avatar">C</div>
          </div>
        </header>

        <div class="glass-panel">
          <div class="premium-table-container">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let bill of bills">
                  <td>#{{ bill.id }}</td>
                  <td>{{ bill.billDate | date:'medium' }}</td>
                  <td>\${{ bill.totalAmount }}</td>
                  <td>
                    <button class="premium-btn" (click)="downloadInvoice(bill.id)" style="padding: 6px 12px; font-size: 0.85rem; gap: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Invoice
                    </button>
                  </td>
                </tr>
                <tr *ngIf="bills.length === 0">
                  <td colspan="4" style="text-align:center;">No bills found for your account.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  `
})
export class CustomerDashboardComponent implements OnInit {
  bills: any[] = [];
  customerPhone: string;

  constructor(
    private apiService: ApiService, 
    public authService: AuthService
  ) {
    // In a real application, the customer phone would be mapped to the logged-in user explicitly,
    // or passed via token claims. For this demo, let's assume the username is the phone number for customer logins.
    this.customerPhone = this.authService.currentUserValue!.username;
  }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.apiService.getCustomerBills(this.customerPhone).subscribe(data => {
      this.bills = data;
    });
  }

  downloadInvoice(billId: number) {
    this.apiService.downloadInvoice(this.customerPhone, billId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${billId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
