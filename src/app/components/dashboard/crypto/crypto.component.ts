import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
import { Router } from '@angular/router';
import { HistoricalDataModel } from '../../../models/HistoricalData.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss'],
})
export class CryptoComponent implements OnInit, OnDestroy {
  cryptos: HistoricalDataModel[] = [];
  subCrypto?: Subscription;
  subDeleteCrypto?: Subscription;
  id?: number;
  symbol_id: string = 'BINANCE_SPOT_ETH_BTC';

  constructor(private cryptoService: CryptoService, private router: Router) {}

  ngOnInit(): void {}

  getHistoricalData(symbol_id: string) {
    this.subCrypto = this.cryptoService.getHistoricalData(symbol_id).subscribe({
      next: (cryptos: HistoricalDataModel[]) => {
        this.cryptos = cryptos;
        console.log(cryptos);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Crypto request is done!');
      },
    });
  }

  showCryptoDetails(crypto: HistoricalDataModel) {
    console.log('Show details for:', crypto);
  }

  ngOnDestroy(): void {
    this.subCrypto?.unsubscribe();
    this.subDeleteCrypto?.unsubscribe();
  }
}
