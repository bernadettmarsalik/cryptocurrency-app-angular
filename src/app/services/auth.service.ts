import { Injectable } from '@angular/core';
import { Observable, Subject, delay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject: Subject<boolean> = new Subject<boolean>();
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  isLoggedIn: boolean = false;
  redirectUrl: string | null = null;
  private readonly LS_KEY = 'authState';

  constructor() {
    const savedState = localStorage.getItem(this.LS_KEY);
    if (savedState) {
      const { isLoggedIn, redirectUrl } = JSON.parse(savedState);
      this.isLoggedIn = isLoggedIn;
      this.redirectUrl = redirectUrl;
    }
  }

  logIn(): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        this.isLoggedIn = true;
        this.saveStateToLocalStorage();
      })
    );
  }

  logOut(): void {
    this.isLoggedIn = false;
    this.saveStateToLocalStorage();
  }

  private saveStateToLocalStorage(): void {
    const authState = JSON.stringify({
      isLoggedIn: this.isLoggedIn,
      redirectUrl: this.redirectUrl,
    });
    localStorage.setItem(this.LS_KEY, authState);
  }
}
