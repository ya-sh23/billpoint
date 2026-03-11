import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Admin APIs
  getPendingRequests(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/requests`);
  }

  getAllShopOwners(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/shop-owners`);
  }

  approveShopOwner(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/shop-owners/${id}/approve`, {}, { responseType: 'text' });
  }

  rejectShopOwner(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/shop-owners/${id}/reject`, {}, { responseType: 'text' });
  }

  // Shop Owner APIs
  getProducts(ownerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/shop-owner/${ownerId}/products`);
  }
  
  addProduct(ownerId: number, product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/shop-owner/${ownerId}/products`, product, { responseType: 'text' });
  }

  getStaffList(ownerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/shop-owner/${ownerId}/staff`);
  }

  addStaff(ownerId: number, staff: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/shop-owner/${ownerId}/staff`, staff, { responseType: 'text' });
  }

  // Staff APIs
  markAttendance(staffId: number, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/staff/${staffId}/attendance?status=${status}`, {}, { responseType: 'text' });
  }

  createBill(staffId: number, shopOwnerId: number, billRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/staff/${staffId}/bills?shopOwnerId=${shopOwnerId}`, billRequest);
  }

  // Customer APIs
  getCustomerBills(phone: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customer/${phone}/bills`);
  }

  downloadInvoice(phone: string, billId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/customer/${phone}/bills/${billId}/pdf`, { responseType: 'blob' });
  }
}
