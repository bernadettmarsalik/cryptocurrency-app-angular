import { Injectable } from '@angular/core';
import { Observable, Subject, of, tap } from 'rxjs';
import { SignUp } from '../models/SignUp.model';

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

  logIn(username: string): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        this.isLoggedIn = true;
        this.saveStateToLocalStorage(username);
      })
    );
  }

  private saveStateToLocalStorage(username?: string): void {
    const authState = JSON.stringify({
      isLoggedIn: this.isLoggedIn,
      redirectUrl: this.redirectUrl,
      username: this.isLoggedIn ? username : undefined,
    });
    localStorage.setItem(this.LS_KEY, authState);
  }

  logOut(username?: string): void {
    this.isLoggedIn = false;
    this.saveStateToLocalStorage(username);
  }

  // private saveStateToLocalStorage(): void {
  //   const authState = JSON.stringify({
  //     isLoggedIn: this.isLoggedIn,
  //     redirectUrl: this.redirectUrl,
  //   });
  //   localStorage.setItem(this.LS_KEY, authState);
  // }

  getLoggedUser(): SignUp | undefined {
    const savedState = localStorage.getItem(this.LS_KEY);
    if (savedState) {
      const { isLoggedIn, redirectUrl, username } = JSON.parse(savedState);
      console.log('Username from saved state:', username);
      if (isLoggedIn) {
        const localUsers = localStorage.getItem('appUsers');
        const users: SignUp[] = localUsers ? JSON.parse(localUsers) : [];
        console.log('All users from local storage:', users);
        const foundUser = users.find((user) => user.username === username);
        console.log('Found user:', foundUser);
        return foundUser;
      }
    }
    return undefined;
  }

  updateUser(user: SignUp): void {
    const localUsers = localStorage.getItem('appUsers');
    let users: SignUp[] = localUsers ? JSON.parse(localUsers) : [];

    // Update the user in the array
    users = users.map((u) => (u.username === user.username ? user : u));

    // Save the updated array back to local storage
    localStorage.setItem('appUsers', JSON.stringify(users));
  }
}
