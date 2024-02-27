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

  logIn(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(() => {
        this.isLoggedIn = true;
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logOut(): void {
    this.isLoggedIn = false;
    this.isLoggedInSubject.next(false);
  }
}
