import { Component, OnDestroy, OnInit } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
import { SignUp } from '../../../models/SignUp.model';
import { HistoricalDataModel } from '../../../models/HistoricalData.model';
import { SymbolMetadataModel } from '../../../models/SymbolMetadata.model';
import { AuthService } from '../../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JsonService } from '../../../services/json.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements OnInit, OnDestroy {
  symbol_id: string = '';
  symbols: any[] = [];
  selectedSymbolId: string = '';
  displayedCryptos: HistoricalDataModel[] = [];
  user?: SignUp;
  walletLength: number = 0;
  wallet: string[] = [];
  calculatedValue?: number;
  selectedCrypto?: string;
  cryptoAmount?: number;
  usdAmount?: number;
  currentDate: Date = new Date();
  tabIndex: number = 0;
  isDisplayedCryptosEmpty = true;
  private historicalDataSubscription: Subscription | undefined;
  displayedCryptos$: Observable<HistoricalDataModel[]> | undefined;

  constructor(
    private cryptoService: CryptoService,
    private authService: AuthService,
    private jsonService: JsonService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedUser();

    if (this.user && this.user.wallet.length > 0) {
      this.isDisplayedCryptosEmpty = false;
      this.walletLength = this.user.wallet.length;
      this.wallet = this.user.wallet;

      this.selectedSymbolId = this.wallet[0];

      console.log(
        'selectedSymbolId from ngOnInit is: ' + this.selectedSymbolId
      );

      this.displayedCryptos$ = this.getHistoricalDataWithApi();

      this.historicalDataSubscription = this.displayedCryptos$.subscribe(
        (cryptos: HistoricalDataModel[]) => {
          this.displayedCryptos = cryptos;
          console.log('displayedCryptos', JSON.stringify(cryptos));
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('Crypto request is done!');
        }
      );

      this.getChartDataForCurrentCrypto();
    } else {
      console.log(
        'No crypto added to the wallet. Add one by clicking on the "+" tab.'
      );
    }

    console.log('Chart Data:', this.chartData);
  }

  // ---------------------------------COINAPI------------------------------------------------------

  getHistoricalDataWithApi(): Observable<HistoricalDataModel[]> {
    return this.cryptoService.getHistoricalData(this.selectedSymbolId);
  }

  getUserSymbols(): void {
    this.user = this.authService.getLoggedUser();

    if (this.user && this.user.wallet.length > 0) {
      this.wallet = this.user.wallet;
    }
  }

  ngOnDestroy(): void {
    if (this.historicalDataSubscription) {
      this.historicalDataSubscription.unsubscribe();
    }

    this.selectedSymbolId = '';
    this.selectedCrypto = '';
  }

  // ---------------------------------NGX CHARTS------------------------------------------------------
  // NGX CHART options
  chartData: HistoricalDataModel[] = [];
  gradient: boolean = false;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Time Period Start';
  yAxisLabel: string = 'Price Close';
  timeline: boolean = true;

  onSelect(data: HistoricalDataModel): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: HistoricalDataModel): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: HistoricalDataModel): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  transformDataForChart(cryptoData: HistoricalDataModel[]): any[] {
    console.log('Input data:', cryptoData);
    cryptoData.sort((a, b) => {
      const dateA = new Date(a.time_period_start).getTime();
      const dateB = new Date(b.time_period_start).getTime();
      return dateA - dateB;
    });

    const chartData = [
      {
        name: 'Price Open',
        series: cryptoData.map((crypto) => ({
          name: new Date(crypto.time_period_start).toLocaleDateString(),
          value: crypto.price_open,
        })),
      },
      {
        name: 'Price Low',
        series: cryptoData.map((crypto) => ({
          name: new Date(crypto.time_period_start).toLocaleDateString(),
          value: crypto.price_low,
        })),
      },
      {
        name: 'Price Close',
        series: cryptoData.map((crypto) => ({
          name: new Date(crypto.time_period_start).toLocaleDateString(),
          value: crypto.price_close,
        })),
      },
    ];

    console.log('Transformed data:', chartData);

    return chartData;
  }

  getChartDataForCurrentCrypto() {
    this.cryptoService.getHistoricalData(this.selectedSymbolId).subscribe({
      next: (cryptos: HistoricalDataModel[]) => {
        this.chartData = this.transformDataForChart(cryptos as any[]);
        console.log('chartData' + this.chartData);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Chart data request is done!');
      },
    });
  }

  // váltó
  calculateValue(): void {
    if (this.cryptoAmount !== undefined) {
      // crypto  -> USD
      this.cryptoService
        .getExchangeRate(this.selectedSymbolId!, 'USD')
        .subscribe({
          next: (exchangeRate: number) => {
            this.calculatedValue = this.cryptoAmount! * exchangeRate;
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else if (this.usdAmount !== undefined) {
      //  USD -> crypto
      this.cryptoService
        .getExchangeRate('USD', this.selectedSymbolId!)
        .subscribe({
          next: (exchangeRate: number) => {
            this.calculatedValue = this.usdAmount! * exchangeRate;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  // tab váltásával más crypto chart
  onTabChange(event: MatTabChangeEvent): void {
    const selectedTabIndex = event.index;

    if (selectedTabIndex >= 0 && selectedTabIndex < this.wallet.length) {
      this.selectedSymbolId = this.wallet[selectedTabIndex];
      console.log(this.selectedSymbolId + ' selectedSymbolId');

      this.getChartDataForCurrentCrypto();
    } else {
      console.error('Invalid selected tab index or wallet array.');
    }
  }

  // modal
  openBootstrapModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  // delete
  onDelete(symbol_id: string): void {
    this.cryptoService.onDelete(symbol_id);
    this.router.navigateByUrl('/dashboard');
  }

  // ---------------------------------JSON SERVER------------------------------------------------------

  getHistoricalDataWithJson(symbol_id: string): void {
    this.jsonService.getHistoricalData(symbol_id).subscribe({
      next: (cryptos: HistoricalDataModel[]) => {
        const foundCrypto = cryptos.find(
          (crypto) => (crypto.symbol_id = symbol_id)
        );
        console.log(foundCrypto?.symbol_id + ' found crypto');

        if (foundCrypto) {
          this.displayedCryptos.push(foundCrypto);
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Crypto request is done!');
      },
    });
  }

  getUserSymbolsWithJson() {
    this.user = this.authService.getLoggedUser();

    if (this.user && this.user.wallet.length > 0) {
      this.wallet = this.user.wallet;
      const userSymbols = this.wallet.join('_');
      console.log('getusersymbolswithjson' + userSymbols);

      this.jsonService.getUserSymbols(userSymbols).subscribe({
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

  getChartDataForCurrentCryptoWithJson() {
    this.jsonService.getHistoricalData(this.selectedSymbolId).subscribe({
      next: (cryptos: HistoricalDataModel[]) => {
        this.chartData = this.transformDataForChart(cryptos as any[]);
        console.log('chartData' + this.chartData);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Chart data request is done!');
      },
    });
  }
}
