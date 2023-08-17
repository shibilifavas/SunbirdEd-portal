import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'https://compass-dev.tarento.com';

  constructor(private http: HttpClient) { }

  login(data: any) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'Access-Control-Allow-Origin': '*'
    });

    return this.http.post(`${this.apiUrl}/auth/realms/sunbird/protocol/openid-connect/token`, data, { headers: httpHeaders });
  }

  register(data: any) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0WEFsdFpGMFFhc1JDYlFnVXB4b2RvU2tLRUZyWmdpdCJ9.mXD7cSvv3Le6o_32lJplDck2D0IIMHnv0uJKq98YVwk',
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/api/user/v1/create`, data, { headers: httpHeaders });
  }

}
