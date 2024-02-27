import { Injectable } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: boolean = false;
  redirectUrl: string | null = null;
  constructor() {}

  logIn(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(() => (this.isLoggedIn = true))
    );
  }

  logOut(): void {
    this.isLoggedIn = false;
  }
}
