import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
import { Router } from '@angular/router';
import { HistoricalDataModel } from '../../../models/HistoricalData.model';
import { Observable, Subscription } from 'rxjs';
import { SymbolMetadataModel } from '../../../models/SymbolMetadata.model';
import { AuthService } from '../../../services/auth.service';
import { SignUp } from '../../../models/SignUp.model';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss'],
})
export class CryptoComponent implements OnInit, OnDestroy {
  // cryptos: HistoricalDataModel[] = [];
  cryptos$: Observable<HistoricalDataModel[]> = new Observable();
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

    // Kriptopénz kiválasztása a wallet[] tömbből
    const user: SignUp | undefined = this.authService.getLoggedUser();
    if (user && user.wallet.length > 0) {
      // Példa: Az első elemet választjuk ki, de itt megírhatod a kiválasztás logikáját
      this.selectedSymbolId = user.wallet[0];

      // Történelmi adatok lekérése a kiválasztott symbol_id-hoz
      this.getHistoricalData();
    }
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
