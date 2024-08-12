import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../service/auth.service';
import { CookieService } from '../service/cookie.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RegisterComponent, LoginComponent,CommonModule,MatIconModule ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  @Input() isLogin = false;
  isLoginMode = true;
  isLoggedIn = false;
  @Output() loginChange = new EventEmitter<boolean>();

  profilePictureUrl: string | null = null;
  fullName: string | null = null; 

  private authService = inject(AuthService);
  private cookieService = inject(CookieService); 
  
  ngOnInit(): void {
    this.checkLoginStatus();

  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  toggleLoginState(isLoggedIn: boolean) {
    this.loginChange.emit(true);
    this.isLogin = isLoggedIn;
  }
  private checkLoginStatus() {
    if (this.authService.isLoggedIn()) {
      this.isLogin = true; 
      this.profilePictureUrl = this.cookieService.getCookie('profilePictureUrl');
      this.fullName = this.cookieService.getCookie('FullName');
    }
  }
  onLoginChange(isLoggedIn: boolean, profilePictureUrl: string | null) {
    this.isLogin = isLoggedIn;
    this.profilePictureUrl = profilePictureUrl;
    this.fullName = this.cookieService.getCookie('FullName');
    console.log('Profile Picture URL updated:', this.profilePictureUrl);
    this.loginChange.emit(isLoggedIn);
  }
  onProfilePictureUrlChange(profilePictureUrl: string | null) {
    this.profilePictureUrl = profilePictureUrl;
    console.log('Profile Picture URL updated:', this.profilePictureUrl);
  }

  onLogout() {
    this.isLoggedIn = false;
    this.isLogin = false; 
    console.log(this.isLogin+"onlogout user")
    this.cookieService.deleteCookie('profilePictureUrl');
    this.cookieService.deleteCookie('FullName');
    this.loginChange.emit(false); 
    this.authService.logout();
    console.log('Logged out successfully.');
  }
}
