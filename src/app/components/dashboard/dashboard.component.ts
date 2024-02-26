import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  loggedUser?: any;
  constructor(private router: Router) {
    const localUser = localStorage.getItem('loggedUser');
    if (localUser != null) {
      this.loggedUser = JSON.parse(localUser);
      console.log('loggedUser:', this.loggedUser);
    }
  }

  onLogOut() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['start']);
  }
}
