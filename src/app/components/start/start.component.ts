import { Component, ElementRef, Renderer2 } from '@angular/core';
import { handleButtonClick } from './start-slider';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  hide = true;
  signUpForm: FormGroup;
  logInForm: FormGroup;
  signUpObj: SignUp = new SignUp();
  logInObj: LogIn = new LogIn();
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.logInForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngAfterViewInit() {
    handleButtonClick(this.renderer, this.el);
  }

  // regisztráció mentése local storage-be
  onSignUp() {
    if (this.signUpForm.valid) {
      const users = this.getStoredUsers();
      users.push(this.signUpForm.value);
      localStorage.setItem('appUsers', JSON.stringify(users));
      alert('Sign Up was successful');
    } else {
      alert('Invalid form, please check your inputs.');
    }
  }

  // bejelentkezés
  onLogIn() {
    if (this.logInForm.valid) {
      const users = this.getStoredUsers();
      const isUser = users.find(
        (user: SignUp) =>
          user.username === this.logInForm.value.username &&
          user.password === this.logInForm.value.password
      );
      if (isUser) {
        alert('User found');
        localStorage.setItem('loggedUser', JSON.stringify(isUser));
        this.router.navigate(['dashboard']);
      } else {
        alert('No User found');
      }
    } else {
      alert('Invalid form, please check your inputs.');
    }
  }

  private getStoredUsers(): SignUp[] {
    const localUsers = localStorage.getItem('appUsers');
    return localUsers ? JSON.parse(localUsers) : [];
  }
}

export class SignUp {
  email: string;
  username: string;
  password: string;

  constructor() {
    this.email = '';
    this.username = '';
    this.password = '';
  }
}

export class LogIn {
  username: string;
  password: string;

  constructor() {
    this.username = '';
    this.password = '';
  }
}
