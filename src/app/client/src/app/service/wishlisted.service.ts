import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface SnackBarData {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistedService {
  private dataSubject = new BehaviorSubject<SnackBarData>({ message: '' });
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) { }

  updateData(data: SnackBarData) {
    this.dataSubject.next(data);
  }

  addToWishlist(payload: any) {
    return this.http.post(`learner/wishlist/v1/add`, payload);
  }

  removeFromWishlist(payload: any) {
    return this.http.post(`learner/wishlist/v1/remove`, payload);
  }

  getWishlistedCourses(payload: any) {
    return this.http.post(`learner/wishlist/v1/get`, payload);
  }

}