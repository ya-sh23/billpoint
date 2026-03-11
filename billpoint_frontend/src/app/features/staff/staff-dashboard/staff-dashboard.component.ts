import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-layout animate-fade-in">
      <aside class="sidebar">
        <div class="logo">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Bill<span>Point</span>
        </div>
        
        <a href="javascript:void(0)" class="nav-item" [class.active]="currentTab === 'billing'" (click)="currentTab = 'billing'">
          POS Billing
        </a>
        
        <div style="margin-top: auto; padding-top: 2rem;">
          <a href="javascript:void(0)" class="nav-item" (click)="logout()" style="color: var(--danger-color);">
            Logout
          </a>
        </div>
      </aside>

      <main class="main-content">
        <header class="header-bar">
          <h2>Point of Sale</h2>
          <div class="user-profile">
            <span style="color: var(--text-secondary)">{{ authService.currentUserValue?.username }}</span>
            <div class="avatar">S</div>
          </div>
        </header>

        <div *ngIf="currentTab === 'billing'" class="glass-panel">
          <form [formGroup]="billForm" (ngSubmit)="onCreateBill()">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
              <div class="form-group">
                <label>Customer Phone</label>
                <input type="text" formControlName="customerPhone" class="premium-input" placeholder="Enter mobile number">
              </div>
              <div class="form-group">
                <label>Customer Name</label>
                <input type="text" formControlName="customerName" class="premium-input" placeholder="Enter Full Name">
              </div>
            </div>

            <div style="margin-bottom: 1rem; display: flex; justify-content: space-between;">
              <h3>Cart Items</h3>
              <button type="button" class="premium-btn" (click)="addItem()">+ Add Item</button>
            </div>

            <div formArrayName="items">
              <div *ngFor="let item of items.controls; let i=index" [formGroupName]="i" style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 1rem; margin-bottom: 1rem; align-items: end;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label>Product ID</label>
                  <input type="number" formControlName="productId" class="premium-input" placeholder="ID">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label>Quantity</label>
                  <input type="number" formControlName="quantity" class="premium-input" placeholder="Qty">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label>Unit Price</label>
                  <input type="number" formControlName="unitPrice" class="premium-input" placeholder="Price">
                </div>
                <button type="button" class="premium-btn danger" style="padding: 10px 16px;" (click)="removeItem(i)">X</button>
              </div>
            </div>

            <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem; text-align: right;">
              <button type="submit" class="premium-btn success" [disabled]="billForm.invalid || items.length === 0">Proceed to Checkout</button>
            </div>
          </form>

          <div *ngIf="lastBillId" style="margin-top: 2rem; background: rgba(46, 160, 67, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid var(--success-color); color: #fff;">
            Bill #{{ lastBillId }} created successfully!
          </div>
        </div>

      </main>
    </div>
  `
})
export class StaffDashboardComponent implements OnInit {
  currentTab: 'billing' = 'billing';
  billForm: FormGroup;
  staffId!: number;
  lastBillId: number | null = null;
  shopOwnerId = 1; // Assuming shop owner ID is 1 for testing. In reality this could be stored in the session or fetched.

  constructor(
    private apiService: ApiService, 
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.staffId = this.authService.currentUserValue!.id;
    this.billForm = this.fb.group({
      customerPhone: ['', Validators.required],
      customerName: ['', Validators.required],
      items: this.fb.array([])
    });
  }

  ngOnInit() {
    this.addItem(); // default 1 empty item
  }

  get items() {
    return this.billForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: ['', [Validators.required, Validators.min(0)]]
    }));
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onCreateBill() {
    if (this.billForm.valid && this.items.length > 0) {
      this.apiService.createBill(this.staffId, this.shopOwnerId, this.billForm.value).subscribe((billRes) => {
        this.lastBillId = billRes.id;
        this.billForm.reset();
        this.items.clear();
        this.addItem();
      });
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
