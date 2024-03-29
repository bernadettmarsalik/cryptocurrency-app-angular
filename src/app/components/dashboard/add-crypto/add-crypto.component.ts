import {
  popularCoins,
  popularCoinsFullName,
} from './../../../../assets/popularCoins';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { SignUp } from '../../../models/SignUp.model';
import { SymbolMetadataModel } from '../../../models/SymbolMetadata.model';
import { Observable } from 'rxjs';
import { CryptoService } from '../../../services/crypto.service';
import { Router } from '@angular/router';

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
  // symbols$: Observable<SymbolMetadataModel[]> = new Observable();
  popularCoins: string[] = popularCoins;
  popularCoinsFullName: string[] = popularCoinsFullName;
  submitMessage: string = '';

  constructor(
    private authService: AuthService,
    private cryptoService: CryptoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.symbols$ = this.cryptoService.getAllSymbols();

    this.addCryptoForm = new FormGroup({
      cryptoId: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.addCryptoForm.valid) {
      const users = this.getStoredUsers();
      const user = this.authService.getLoggedUser();
      const cryptoId = this.addCryptoForm.get('cryptoId')?.value;

      if (user) {
        if (user.wallet.includes(cryptoId)) {
          alert('Crypto already added before!');
        } else {
          user.wallet.push(cryptoId);
          this.authService.updateUser(user);
          this.addCryptoForm.reset();
          this.submitMessage = 'Crypto added succesfully. ';
          setTimeout(() => {
            this.router.navigateByUrl('/dashboard');
          }, 600);
        }
      } else {
        this.submitMessage = 'User not found. Please log in again.';
      }
    } else {
      this.submitMessage = 'Invalid form, please check your inputs.';
    }
  }

  private getStoredUsers(): SignUp[] {
    const localUsers = localStorage.getItem('appUsers');
    return localUsers ? JSON.parse(localUsers) : [];
  }
}
