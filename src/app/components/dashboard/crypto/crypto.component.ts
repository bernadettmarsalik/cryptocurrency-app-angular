import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
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

  allCryptos: HistoricalDataModel[] = [];

  ngOnInit(): void {
    const user: SignUp | undefined = this.authService.getLoggedUser();
    if (user && user.wallet.length > 0) {
      for (const symbolId of user.wallet) {
        this.getHistoricalData(symbolId);
      }
    } else {
      console.log('No crypto added to wallet. Add one.');
    }
  }

  getHistoricalData(symbolId: string) {
    this.cryptoService.getHistoricalData(symbolId).subscribe({
      next: (cryptos: HistoricalDataModel[]) => {
        // Az összes történelmi adatot tárold el a közös listában
        this.allCryptos = [...this.allCryptos, ...cryptos];
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Crypto request is done!');
      },
    });
  }

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
