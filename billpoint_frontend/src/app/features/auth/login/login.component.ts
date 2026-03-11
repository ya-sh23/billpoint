import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  selectedRole: 'CUSTOMER' | 'STAFF' | 'SHOP_OWNER' | 'ADMIN' = 'CUSTOMER';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
      this.redirectUser(this.authService.currentUserValue.role);
    }
    
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  setRole(role: 'CUSTOMER' | 'STAFF' | 'SHOP_OWNER' | 'ADMIN') {
    this.selectedRole = role;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';
    
    const loginData = {
      ...this.loginForm.value,
      role: this.selectedRole
    };

    this.authService.login(loginData)
      .subscribe({
        next: (user) => {
          this.redirectUser(user.role);
        },
        error: (err) => {
          this.error = err.error || 'Login failed. Please try again.';
          this.loading = false;
        }
      });
  }

  private redirectUser(role: string) {
    switch(role) {
      case 'ADMIN': this.router.navigate(['/admin']); break;
      case 'SHOP_OWNER': this.router.navigate(['/shop-owner']); break;
      case 'STAFF': this.router.navigate(['/staff']); break;
      case 'CUSTOMER': this.router.navigate(['/customer']); break;
      default: this.router.navigate(['/']);
    }
  }
}
