import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-crypto',
  templateUrl: './add-crypto.component.html',
  styleUrl: './add-crypto.component.scss',
})
export class AddCryptoComponent {
  addCryptoForm: FormGroup;
  cryptoSymbolIds: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.addCryptoForm = this.fb.group({
      symbolId: ['', Validators.required],
      // Add other form controls as needed
    });
  }

  ngOnInit(): void {
    this.fetchCryptoSymbolIds();
  }

  fetchCryptoSymbolIds(): void {
    // Fetch crypto symbol ids from CoinAPI
    this.http.get<any[]>('https://rest.coinapi.io/v1/symbols').subscribe(
      (symbols: any[]) => {
        this.cryptoSymbolIds = symbols.map((symbol) => symbol.symbol_id);
      },
      (error) => {
        console.error('Error fetching crypto symbol ids:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.addCryptoForm.valid) {
      const formValues = this.addCryptoForm.value;

      const symbolId = formValues.symbolId;

      const savedState = localStorage.getItem('authState');
      if (savedState) {
        const authState = JSON.parse(savedState);
        authState.wallet.push(symbolId);
        localStorage.setItem('authState', JSON.stringify(authState));
      }

      // Reset the form after submission
      this.addCryptoForm.reset();
    }
  }
}
