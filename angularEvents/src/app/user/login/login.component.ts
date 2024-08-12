import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserLogin } from '../../Models/userlogin.model';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { EventService } from '../../service/event.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Input({ required: true }) password!: string | undefined;
  @Input({ required: true }) userName!: string | undefined;
  @Output() isLogin = new EventEmitter<boolean>();
  @Output() profilePictureUrlChange = new EventEmitter<string | null>();

 

  constructor(private cdRef: ChangeDetectorRef) {}
  private authService = inject(AuthService);
  private eventService = inject(EventService);


  onLogin() {
    const userLogin: UserLogin = {
      username: this.userName || '',
      password: this.password || '',
    };

    this.authService.login(
      userLogin,
      (response) => {
        //console.log(`Login for ${userLogin.username} succeeded`);
        console.log("login return", response);
       // console.log(`Login for ${response['profilePictureUrl']} succeeded`);
        this.profilePictureUrlChange.emit(response['profilePictureUrl']);
        //const profilePictureUrl = response['profilePictureUrl'];
       // console.log('Profile Picture URL:', profilePictureUrl);
        const profilePictureUrl = response['profilePictureUrl'];
        const fullName = response["fullName"];
        this.setCookie('profilePictureUrl', profilePictureUrl, 7);
        this.setCookie('FullName', fullName, 7);
        this.isLogin.emit(true);
        window.location.reload();
        },
      (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    );
  }
  onLogout() {
    console.log("login page")
    console.log("login Component : onLogout" +this.isLogin);
    this.isLogin.emit(false);
    console.log("login Component : onLogout" +this.isLogin);
    this.userName = '';
    this.password = '';
    this.authService.logout();
    this.eventService.clearEvents();
    console.log('Logged out successfully.');
  }

  private setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; Secure; SameSite=Strict';
  }

  private deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict';
  }
}
