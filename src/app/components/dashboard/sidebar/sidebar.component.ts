import { Component } from '@angular/core';
import { SignUp } from '../../../models/SignUp.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  loggedUser?: SignUp;
  constructor(private router: Router, private authService: AuthService) {
    const localUser = localStorage.getItem('loggedUser');
    if (localUser != null) {
      this.loggedUser = JSON.parse(localUser);
      console.log('loggedUser:', this.loggedUser);
      this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
        this.authService.isLoggedIn = isLoggedIn;
      });
    }
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigate(['/logout']);
  }
}
