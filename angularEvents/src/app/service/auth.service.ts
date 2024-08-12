import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserLogin } from '../Models/userlogin.model';
import { CookieService } from 'ngx-cookie-service';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5024/api/User';
  private tokenKey = 'auth_token';

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) {}

  login(
    userlogin: any,
    successCallback: (response: any) => void,
    errorCallback: (error: any) => void
  ) {
    return this.httpClient.post(`${this.apiUrl}/login`, userlogin).subscribe({
      next: (response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
        successCallback(response);
      },
      error: (error) => {
        console.error('HTTP Error', error);
        if (error.status === 401) {
          console.log('Invalid credentials. Please try again.');
        } else {
          console.log('An error occurred. Please try again later.');
        }
        errorCallback(error);
      },
    });
  }

  isLoggedIn(): boolean {
    return this.cookieService.check(this.tokenKey);
  }

  logout(): void {
    console.log("logout");
    this.clearToken();
  }

  

  private setToken(token: string): void {
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1); 

    this.cookieService.set(
      this.tokenKey,
      token,
      expireDate,
      '/',
      '',
      true,
      'Strict'
    );
  }

  public  getToken(): string | null {
    return this.cookieService.get(this.tokenKey) || null;
  }

  private clearToken(): void {
    console.log("clearToken");
    console.log(this.cookieService);
    console.log(this.cookieService.getAll());
    this.cookieService.deleteAll();
  }
/*
  register(userRegister: any, callback: (user: any) => void) {
    console.log(userRegister)
    return this.httpClient
      .post(`${this.apiUrl}/register`, userRegister)
      .subscribe({
        next: (response) => {
          callback(response);
        },
        error: (error) => {
          console.error('An error occurred:', error);
        },
        complete: () => {
          console.log('Registration process completed');
        },
      });
  }
*/

register(formData: FormData, callback: (response: any) => void, errorCallback?: (error: any) => void): void {
  this.httpClient.post(`${this.apiUrl}/register`, formData).subscribe({
    next: (response) => {
      callback(response);
    },
    error: (error) => {
      console.error('An error occurred during registration:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    },
    complete: () => {
      console.log('Registration process completed');
    }
  });
}
}
