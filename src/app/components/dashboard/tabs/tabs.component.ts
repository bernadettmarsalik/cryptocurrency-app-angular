import { Component, OnDestroy, OnInit } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
import { SignUp } from '../../../models/SignUp.model';
import { Subscription } from 'rxjs';
import { HistoricalDataModel } from '../../../models/HistoricalData.model';
import { SymbolMetadataModel } from '../../../models/SymbolMetadata.model';
import { AuthService } from '../../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JsonService } from '../../../services/json.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

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
  calculatedValue?: number;
  amount?: number;
  selectedCrypto?: string;
  cryptoAmount?: number;
  usdAmount?: number;
  currentDate: Date = new Date();

  constructor(
    private cryptoService: CryptoService,
    private authService: AuthService,
    private jsonService: JsonService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // this.getAllSymbols();
    // this.cryptos$ = this.cryptoService.getHistoricalData(this.symbol_id);
    this.selectedSymbolId = '';
    this.selectedCrypto = '';

    this.user = this.authService.getLoggedUser();

    if (this.user && this.user.wallet.length > 0) {
      this.walletLength = this.user.wallet.length;
      this.wallet = this.user.wallet;

      this.wallet.forEach((crypto) => {
        this.selectedSymbolId = crypto;

        this.getHistoricalDataWithJson(this.selectedSymbolId);
      });
    } else {
      console.log('No crypto added to wallet. Add one by click on "+" tab.');
    }
  }

  // ---------------------------------COINAPI------------------------------------------------------

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
  getChartDataForCurrentCrypto() {
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

  links = ['+'];
  activeLink = this.links[0];

  // ---------------------------------JSON SERVER------------------------------------------------------

  getHistoricalDataWithJson(symbol_id: string) {
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
    // Assuming this.selectedSymbolId is the current crypto's symbol_id
    this.jsonService.getHistoricalData(this.selectedSymbolId).subscribe({
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

  ngOnDestroy(): void {
    this.subCrypto?.unsubscribe();
    this.subDeleteCrypto?.unsubscribe();
    this.selectedSymbolId = '';
    this.selectedCrypto = '';
  }

  // ---------------------------------NGX CHARTS------------------------------------------------------

  transformDataForChart(cryptos: HistoricalDataModel[]): any[] {
    return [
      {
        name: 'Árfolyam',
        series: cryptos.map((crypto) => ({
          name: crypto.time_period_start,
          value: crypto.price_open,
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

  calculateValue(): void {
    if (this.cryptoAmount !== undefined) {
      // Convert crypto to USD
      this.cryptoService
        .getExchangeRate(this.selectedCrypto!, 'USD')
        .subscribe({
          next: (exchangeRate: number) => {
            this.calculatedValue = this.cryptoAmount! * exchangeRate;
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else if (this.usdAmount !== undefined) {
      // Convert USD to crypto
      this.cryptoService
        .getExchangeRate('USD', this.selectedCrypto!)
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

  extractCryptoPart(selectedSymbolId: string): string {
    const parts = selectedSymbolId.split('_');
    return parts[2];
  }

  onTabChange(event: MatTabChangeEvent): void {
    const selectedTabSymbol = this.wallet[event.index];
    this.selectedSymbolId = selectedTabSymbol;
    this.selectedCrypto = this.extractCryptoPart(selectedTabSymbol);
    console.log(this.selectedCrypto + ' selectedcrypto');
  }
}
