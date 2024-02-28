import { Component, OnDestroy, OnInit } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
import { SignUp } from '../../../models/SignUp.model';
import { Subscription } from 'rxjs';
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
  symbol_id: string = 'BINANCE_SPOT_ETH_BTC';
  symbols: any[] = [];
  selectedSymbolId: string = '';
  displayedCryptos: HistoricalDataModel[] = [];

  constructor(
    private cryptoService: CryptoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.getAllSymbols();
    // this.cryptos$ = this.cryptoService.getHistoricalData(this.symbol_id);

    const user: SignUp | undefined = this.authService.getLoggedUser();
    if (user && user.wallet.length > 0) {
      this.selectedSymbolId = user.wallet[0];
      this.getHistoricalData();
    } else console.log('No crypto added to wallet. Add one.');
  }

  getHistoricalData() {
    // Kiválasztott symbol_id használata a történelmi adatok lekéréséhez
    this.cryptoService.getHistoricalData(this.selectedSymbolId).subscribe({
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

  // getHistoricalData(symbol_id: string) {
  //   this.subCrypto = this.cryptoService.getHistoricalData(symbol_id).subscribe({
  //     next: (cryptos: HistoricalDataModel[]) => {
  //       this.cryptos = cryptos;
  //       console.log(cryptos);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => {
  //       console.log('Crypto request is done!');
  //     },
  //   });
  // }

  getAllSymbols() {
    this.cryptoService.getAllSymbols().subscribe({
      next: (symbols: SymbolMetadataModel[]) => {
        this.symbols = symbols;
        console.log(symbols);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Get all symbols request is done!');
      },
    });
  }

  ngOnDestroy(): void {
    this.subCrypto?.unsubscribe();
    this.subDeleteCrypto?.unsubscribe();
  }
}
