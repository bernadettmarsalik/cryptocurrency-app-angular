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
  symbols$: Observable<SymbolMetadataModel[]> = new Observable();
  popularCoins: string[] = popularCoins;
  popularCoinsFullName: string[] = popularCoinsFullName;

  constructor(
    private authService: AuthService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.symbols$ = this.cryptoService.getAllSymbols();

    this.addCryptoForm = new FormGroup({
      symbolId: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.addCryptoForm.valid) {
      const users = this.getStoredUsers();
      const user = this.authService.getLoggedUser();
      const symbolId = this.addCryptoForm.get('symbolId')?.value;
      const symbolWalletData = `BINANCE_SPOT_${symbolId}_USD`;

      if (user) {
        if (user.wallet.includes(symbolWalletData)) {
          alert('Crypto already added before!');
        } else {
          user.wallet.push(symbolWalletData);
          this.authService.updateUser(user);
          this.addCryptoForm.reset();
          console.log('Crypto added');
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
