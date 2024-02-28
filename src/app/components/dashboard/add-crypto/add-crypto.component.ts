import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { SignUp } from '../../../models/SignUp.model';

@Component({
  selector: 'app-add-crypto',
  templateUrl: './add-crypto.component.html',
  styleUrls: ['./add-crypto.component.scss'],
})
export class AddCryptoComponent implements OnInit {
  addCryptoForm!: FormGroup;
  userWallet: string[] = [];
  signUpObj: SignUp = { email: '', username: '', password: '', wallet: [] };
  loggedUser?: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.addCryptoForm = new FormGroup({
      symbolId: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.addCryptoForm.valid) {
      const users = this.getStoredUsers();
      const user = this.authService.getLoggedUser();

      if (user) {
        if (user.wallet.includes(this.addCryptoForm.get('symbolId')?.value)) {
          alert('Crypto already added before!');
        } else {
          user.wallet.push(this.addCryptoForm.get('symbolId')?.value);
          this.authService.updateUser(user);
          this.addCryptoForm.reset();
          alert('Crypto added');
        }
      } else {
        alert('User not found. Please log in again.');
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
