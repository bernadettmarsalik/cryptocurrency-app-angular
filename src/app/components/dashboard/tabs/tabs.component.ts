import { Component, OnDestroy, OnInit } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
import { SignUp } from '../../../models/SignUp.model';
import { Subscription, map } from 'rxjs';
import { HistoricalDataModel } from '../../../models/HistoricalData.model';
import { SymbolMetadataModel } from '../../../models/SymbolMetadata.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements OnInit, OnDestroy {
  // cryptos$: Observable<HistoricalDataModel[]> = new Observable();
  subCrypto?: Subscription;
  subDeleteCrypto?: Subscription;
  symbol_id: string = '';
  symbols: any[] = [];
  selectedSymbolId: string = '';
  displayedCryptos: HistoricalDataModel[] = [];
  user?: SignUp;
  walletLength: number = 0;
  wallet: string[] = [];

  constructor(
    private cryptoService: CryptoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.getAllSymbols();
    // this.cryptos$ = this.cryptoService.getHistoricalData(this.symbol_id);

    this.user = this.authService.getLoggedUser();

    if (this.user && this.user.wallet.length > 0) {
      this.walletLength = this.user.wallet.length;
      this.wallet = this.user.wallet;

      // Use forEach to iterate through the wallet and get data for each crypto
      this.wallet.forEach((crypto) => {
        // Assign the current crypto to selectedSymbolId
        this.selectedSymbolId = crypto;

        // Call the method to get historical data for the current crypto
        this.getHistoricalData(this.selectedSymbolId);
      });
    } else {
      console.log('No crypto added to wallet. Add one.');
    }
  }

  getHistoricalData(symbol_id: string) {
    this.cryptoService.getHistoricalData(symbol_id).subscribe({
      next: (cryptos: HistoricalDataModel[]) => {
        this.displayedCryptos = cryptos;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Crypto request is done!');
      },
    });
  }

  getUserSymbols() {
    this.user = this.authService.getLoggedUser();

    if (this.user && this.user.wallet.length > 0) {
      this.wallet = this.user.wallet;
      const userSymbols = this.wallet.join('_');

      this.cryptoService.getUserSymbols(userSymbols).subscribe({
        next: (symbols: SymbolMetadataModel[]) => {
          this.symbols = symbols;
          console.log('symbols:', symbols);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('Symbols request is done!');
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.subCrypto?.unsubscribe();
    this.subDeleteCrypto?.unsubscribe();
  }
}
