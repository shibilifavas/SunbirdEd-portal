import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistedService {

  constructor(private http: HttpClient) { }


  addToWishlist(payload: any) {
    return this.http.post(`api/wishlist/v1/add`, payload);
  }

  removeFromWishlist(payload: any) {
    return this.http.post(`api/wishlist/v1/remove`, payload);
  }

}