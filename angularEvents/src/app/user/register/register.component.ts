import {  Component, inject, Input } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserRegister } from '../../Models/userregister.model';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // MatProgressSpinnerModule'ü ekleyin

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @Input({ required: true }) password!: string | undefined;
  @Input({ required: true }) userName!: string | undefined;
  @Input({ required: true }) email!: string | undefined;
  @Input({ required: true }) FullName!: string | undefined;
  isLoading = false;
  selectedFile: File | null = null;

  private authService = inject(AuthService);

  onRegister(registerForm: NgForm) {
    if (!this.selectedFile) {
      console.error('Please select a file');
      return;
    }

    this.isLoading = true;
    const userRegister: UserRegister = {
      username: this.userName || '',
      password: this.password || '',
      email: this.email || '',
      FullName: this.FullName || '',
    };

    const formData: FormData = new FormData();
    formData.append('username', userRegister.username);
    formData.append('password', userRegister.password);
    formData.append('email', userRegister.email);
    formData.append('profilePicture', this.selectedFile);
    formData.append('FullName', userRegister.FullName);

    const startTime = Date.now();

    this.authService.register(
      formData,
      (response) => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 500 - elapsedTime;

        setTimeout(
          () => {
            console.log('User registered successfully:', response);
            this.isLoading = false;
            console.log('isLoading after success:', this.isLoading);

            registerForm.resetForm();
          },
          remainingTime > 0 ? remainingTime : 0
        );
      },
      (error: any) => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 500 - elapsedTime;
        setTimeout(
          () => {
            console.error('Registration failed:', error);
            this.isLoading = false;
          },
          remainingTime > 0 ? remainingTime : 0
        );
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
