import { Component, ElementRef, Renderer2 } from '@angular/core';
import { handleButtonClick } from './start-slider';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../services/auth.service';
import { LogIn } from '../../models/LogIn.model';
import { SignUp } from '../../models/SignUp.model';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  hide = true;
  signUpForm: FormGroup;
  logInForm: FormGroup;
  signUpObj: SignUp = { email: '', username: '', password: '', wallet: [] };
  logInObj: LogIn = { username: '', password: '' };
  loggedUser?: any;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    public authService: AuthService
  ) {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.authService.isLoggedIn = isLoggedIn;
    });
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

      const usernameExists = users.some(
        (user: SignUp) => user.username === this.signUpForm.value.username
      );
      const emailExists = users.some(
        (user: SignUp) => user.email === this.signUpForm.value.email
      );

      if (usernameExists || emailExists) {
        alert(
          'Username or email already exists. Please choose a different one.'
        );
        return;
      }

      // jelszó hashelése bcrypttel
      const length = 10;
      const hashedPassword = bcrypt.hashSync(
        this.signUpForm.value.password,
        length
      );

      const newUser = {
        email: this.signUpForm.value.email,
        username: this.signUpForm.value.username,
        password: hashedPassword,
        wallet: [],
      };

      users.push(newUser);
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
      const inputPassword = this.logInForm.value.password;

      const foundUser = users.find(
        (user: SignUp) => user.username === this.logInForm.value.username
      );

      if (foundUser) {
        const isPasswordMatch = bcrypt.compareSync(
          inputPassword,
          foundUser.password
        );

        if (isPasswordMatch) {
          console.log('User found');
          this.authService.logIn().subscribe(() => {
            this.router.navigate(['/dashboard']);
          });
        } else {
          alert('Invalid password');
        }
      } else {
        alert('No user found');
      }
    } else {
      alert('Invalid form, please check your inputs.');
    }
  }

  onLogOut() {
    this.authService.isLoggedIn = false;
    this.router.navigate(['start']);
  }

  private getStoredUsers(): SignUp[] {
    const localUsers = localStorage.getItem('appUsers');
    return localUsers ? JSON.parse(localUsers) : [];
  }
}
