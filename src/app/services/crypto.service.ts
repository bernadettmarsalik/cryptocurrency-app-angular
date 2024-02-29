import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
import {
  EXCHANGE_ID_COINBASE,
  SYMBOL_TYPE_SPOT,
  SymbolMetadataModel,
  USD_ASSET_ID,
} from '../models/SymbolMetadata.model';
import { popularCoins } from '../../assets/popularCoins';
import { HistoricalDataModel } from '../models/HistoricalData.model';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly API_KEY: string = '4E8C07B5-B5DA-4AC4-B8D4-3B9A9E2358B9';
  private readonly API_URL = 'https://api.coinapi.io/v1';

  symbolMetadata: SymbolMetadataModel = {
    symbol_id: 'COINBASE_SPOT_BTC_USD',
    exchange_id: EXCHANGE_ID_COINBASE,
    symbol_type: SYMBOL_TYPE_SPOT,
    asset_id_base: 'BTC',
    asset_id_quote: USD_ASSET_ID,
    data_start: '',
    data_end: '',
    data_quote_start: '',
    data_quote_end: '',
    data_orderbook_start: '',
    data_orderbook_end: '',
    data_trade_start: '',
    data_trade_end: '',
    volume_1hrs: 0,
    volume_1hrs_usd: 0,
    volume_1day: 0,
    volume_1day_usd: 0,
    volume_1mth: 0,
    volume_1mth_usd: 0,
    price: 0,
    symbol_id_exchange: '',
    asset_id_base_exchange: '',
    asset_id_quote_exchange: '',
    price_precision: 0,
    size_precision: 0,
  };

  constructor(private http: HttpClient) {}

  getHistoricalData(symbol_id: string): Observable<HistoricalDataModel[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const currentTime = new Date().toISOString();
    const oneWeekAgoTime = oneWeekAgo.toISOString();

    const url = `${this.API_URL}/ohlcv/${symbol_id}/history?period_id=7DAY&time_start=${oneWeekAgoTime}&time_end=${currentTime}`;
    console.log('Request URL:', url);

    const headers = new HttpHeaders({
      'X-CoinAPI-Key': this.API_KEY,
    });
    return this.http.get<any>(url, { headers });
  }

  getSymbolsDataForWallet(wallet: string[]): Observable<any[]> {
    const observables: Observable<any>[] = [];

    wallet.forEach((symbol_id) => {
      // For each symbol in the wallet, create an observable to get historical data
      observables.push(this.getHistoricalData(symbol_id));
    });

    // Use forkJoin to combine observables and get results once all are completed
    return forkJoin(observables);
  }

  getUserSymbols(userSymbols: string): Observable<SymbolMetadataModel[]> {
    const filterSymbolId = 'COINBASE_SPOT';

    const url = `https://rest.coinapi.io/v1/symbols?filter_symbol_id=${filterSymbolId}&filter_exchange_id=${userSymbols}&filter_asset_id=USD`;
    // const url = `${this.API_URL}/symbols?filter_symbol_id=COINBASE_SPOT&filter_asset_id=USD`;

    const headers = new HttpHeaders({
      'X-CoinAPI-Key': this.API_KEY,
    });

    return this.http.get<SymbolMetadataModel[]>(url, { headers });
  }

  getAllSymbols(): Observable<SymbolMetadataModel[]> {
    // A túl sok kérés miatt és 429 status miatt limitálni kellett a lekérhető adatok számát 20-ra

    const filterSymbolId = 'COINBASE_SPOT';

    const url = `https://rest.coinapi.io/v1/symbols?filter_symbol_id=${filterSymbolId}&filter_exchange_id=${popularCoins}&filter_asset_id=USD`;
    // const url = `${this.API_URL}/symbols?filter_symbol_id=COINBASE_SPOT&filter_asset_id=USD`;

    const headers = new HttpHeaders({
      'X-CoinAPI-Key': this.API_KEY,
    });

    return this.http.get<SymbolMetadataModel[]>(url, { headers });
  }

  saveSymbols() {}

  // Váltó
  getExchangeRate(
    assetIdBase: string,
    assetIdQuote: string
  ): Observable<number> {
    const url = `https://rest.coinapi.io/v1/exchangerate/${assetIdBase}/${assetIdQuote}`;
    const headers = new HttpHeaders({
      'X-CoinAPI-Key': this.API_KEY,
    });

    return this.http.get<any>(url, { headers }).pipe(
      map((response) => {
        if (response.rate) {
          return response.rate;
        } else {
          throw new Error('Exchange rate not found in response');
        }
      }),
      catchError((error) => {
        console.error('Exchange rate request error:', error);
        return throwError('Failed to fetch exchange rate');
      })
    );
  }
}
