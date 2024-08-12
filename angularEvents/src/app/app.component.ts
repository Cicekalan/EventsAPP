import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user.component';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserComponent, EventsComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angularEvents-';
  isLogin = false;
  isLoading = true;

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false; 
    }, 1000);
    this.isLogin = this.authService.isLoggedIn();

  }

  
  onLoginChange(isLoggedIn: boolean) {
    console.log('AppComponent: Login status received:', isLoggedIn);
    this.isLogin = isLoggedIn;
    if (this.isLogin) {
      this.reloadCurrentRoute();
      console.log('AppComponent: isLogin set to:', this.isLogin);
    }
  }
  
  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}

