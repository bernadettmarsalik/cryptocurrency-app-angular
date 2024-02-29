import { Component, OnDestroy, OnInit } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
import { SignUp } from '../../../models/SignUp.model';
import { Subscription } from 'rxjs';
import { HistoricalDataModel } from '../../../models/HistoricalData.model';
import { SymbolMetadataModel } from '../../../models/SymbolMetadata.model';
import { AuthService } from '../../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // this.getAllSymbols();
    // this.cryptos$ = this.cryptoService.getHistoricalData(this.symbol_id);

    this.user = this.authService.getLoggedUser();

    if (this.user && this.user.wallet.length > 0) {
      this.walletLength = this.user.wallet.length;
      this.wallet = this.user.wallet;

      this.wallet.forEach((crypto) => {
        this.selectedSymbolId = crypto;

        this.getHistoricalData(this.selectedSymbolId);
      });
    } else {
      console.log('No crypto added to wallet. Add one by click on "+" tab.');
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

  links = ['+'];
  activeLink = this.links[0];

  ngOnDestroy(): void {
    this.subCrypto?.unsubscribe();
    this.subDeleteCrypto?.unsubscribe();
  }

  getChartDataForCurrentCrypto() {
    // Assuming this.selectedSymbolId is the current crypto's symbol_id
    this.cryptoService.getHistoricalData(this.selectedSymbolId).subscribe({
      next: (cryptos: HistoricalDataModel[]) => {
        this.chartData = this.transformDataForChart(
          cryptos as HistoricalDataModel[]
        );
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Chart data request is done!');
      },
    });
  }

  transformDataForChart(cryptos: HistoricalDataModel[]): any[] {
    return [
      {
        name: 'Árfolyam',
        series: cryptos.map((crypto) => ({
          name: crypto.time_period_start,
          value: crypto.price_close,
        })),
      },
    ];
  }
  // options
  chartData: any[] = [];
  gradient: boolean = false;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Time Period Start';
  yAxisLabel: string = 'Price Close';

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
