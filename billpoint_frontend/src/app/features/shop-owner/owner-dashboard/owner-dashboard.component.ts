import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-layout animate-fade-in">
      <aside class="sidebar">
        <div class="logo">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Bill<span>Point</span>
        </div>
        
        <a href="javascript:void(0)" class="nav-item" [class.active]="currentTab === 'inventory'" (click)="currentTab = 'inventory'">
          Inventory
        </a>
        
        <a href="javascript:void(0)" class="nav-item" [class.active]="currentTab === 'staff'" (click)="currentTab = 'staff'">
          Staff Management
        </a>
        
        <div style="margin-top: auto; padding-top: 2rem;">
          <a href="javascript:void(0)" class="nav-item" (click)="logout()" style="color: var(--danger-color);">
            Logout
          </a>
        </div>
      </aside>

      <main class="main-content">
        <header class="header-bar">
          <h2>{{ currentTab === 'inventory' ? 'Inventory Management' : 'Staff Management' }}</h2>
          <div class="user-profile">
            <span style="color: var(--text-secondary)">{{ authService.currentUserValue?.username || 'Owner' }}</span>
            <div class="avatar">O</div>
          </div>
        </header>

        <!-- Inventory Tab -->
        <div *ngIf="currentTab === 'inventory'" class="glass-panel">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2rem;">
            <h3>Products List</h3>
            <button class="premium-btn" (click)="showProductForm = !showProductForm">
              {{ showProductForm ? 'Close Form' : 'Add New Product' }}
            </button>
          </div>

          <!-- Add Product Form -->
          <div *ngIf="showProductForm" class="glass-panel" style="margin-bottom: 2rem; background: rgba(0,0,0,0.2);">
            <form [formGroup]="productForm" (ngSubmit)="onAddProduct()">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label>Title</label>
                  <input type="text" formControlName="name" class="premium-input" placeholder="Product Name">
                </div>
                <div class="form-group">
                  <label>Price</label>
                  <input type="number" formControlName="price" class="premium-input" placeholder="Price">
                </div>
                <div class="form-group">
                  <label>Stock Quantity</label>
                  <input type="number" formControlName="stockQuantity" class="premium-input" placeholder="Stock">
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <input type="text" formControlName="description" class="premium-input" placeholder="Description">
                </div>
              </div>
              <button type="submit" class="premium-btn success" [disabled]="productForm.invalid">Save Product</button>
            </form>
          </div>

          <div class="premium-table-container">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of products">
                  <td>#{{ p.id }}</td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.price }}</td>
                  <td>{{ p.stockQuantity }}</td>
                </tr>
                <tr *ngIf="products.length === 0">
                  <td colspan="4" style="text-align:center;">No products found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Staff Tab -->
        <div *ngIf="currentTab === 'staff'" class="glass-panel">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2rem;">
            <h3>Staff List</h3>
            <button class="premium-btn" (click)="showStaffForm = !showStaffForm">
              {{ showStaffForm ? 'Close Form' : 'Add New Staff' }}
            </button>
          </div>

          <!-- Add Staff Form -->
          <div *ngIf="showStaffForm" class="glass-panel" style="margin-bottom: 2rem; background: rgba(0,0,0,0.2);">
            <form [formGroup]="staffForm" (ngSubmit)="onAddStaff()">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label>Name</label>
                  <input type="text" formControlName="name" class="premium-input" placeholder="Full Name">
                </div>
                <div class="form-group">
                  <label>Contact</label>
                  <input type="text" formControlName="contact" class="premium-input" placeholder="Phone">
                </div>
                <div class="form-group">
                  <label>Username</label>
                  <input type="text" formControlName="username" class="premium-input" placeholder="Login Username">
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <input type="password" formControlName="password" class="premium-input" placeholder="Login Password">
                </div>
              </div>
              <button type="submit" class="premium-btn success" [disabled]="staffForm.invalid">Save Staff</button>
            </form>
          </div>

          <div class="premium-table-container">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of staffList">
                  <td>#{{ s.userId }}</td>
                  <td>{{ s.name }}</td>
                  <td>{{ s.contact }}</td>
                  <td>{{ s.username }}</td>
                </tr>
                <tr *ngIf="staffList.length === 0">
                  <td colspan="4" style="text-align:center;">No staff found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  `
})
export class OwnerDashboardComponent implements OnInit {
  currentTab: 'inventory' | 'staff' = 'inventory';
  showProductForm = false;
  showStaffForm = false;

  products: any[] = [];
  staffList: any[] = [];
  ownerId!: number;

  productForm: FormGroup;
  staffForm: FormGroup;

  constructor(
    private apiService: ApiService, 
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.ownerId = this.authService.currentUserValue!.id;

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });

    this.staffForm = this.fb.group({
      name: ['', Validators.required],
      contact: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadStaff();
  }

  loadProducts() {
    this.apiService.getProducts(this.ownerId).subscribe(data => this.products = data);
  }

  loadStaff() {
    this.apiService.getStaffList(this.ownerId).subscribe(data => this.staffList = data);
  }

  onAddProduct() {
    if (this.productForm.valid) {
      this.apiService.addProduct(this.ownerId, this.productForm.value).subscribe(() => {
        this.loadProducts();
        this.productForm.reset();
        this.showProductForm = false;
      });
    }
  }

  onAddStaff() {
    if (this.staffForm.valid) {
      this.apiService.addStaff(this.ownerId, this.staffForm.value).subscribe(() => {
        this.loadStaff();
        this.staffForm.reset();
        this.showStaffForm = false;
      });
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
