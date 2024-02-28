import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { SymbolMetadataModel } from '../models/SymbolMetadata.model';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly API_KEY: string = '4E8C07B5-B5DA-4AC4-B8D4-3B9A9E2358B9';
  private readonly API_URL = 'https://api.coinapi.io/v1';

  constructor(private http: HttpClient) {}

  getHistoricalData(symbol_id: string): Observable<any> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const currentTime = new Date().toISOString();
    const oneWeekAgoTime = oneWeekAgo.toISOString();

    const url = `${this.API_URL}/ohlcv/${symbol_id}/history?period_id=7DAY&time_start=${oneWeekAgoTime}&time_end=${currentTime}`;
    // const url = `${this.API_URL}/ohlcv/${symbol_id}/history?period_id=7DAY&time_start=2024-01-01T00:00:00`;
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

  getUserSymbols(): Observable<SymbolMetadataModel[]> {
    const url = `${this.API_URL}/symbols?filter_symbol_id=COINBASE_SPOT&filter_asset_id=USD`;

    const headers = new HttpHeaders({
      'X-CoinAPI-Key': this.API_KEY,
    });

    return this.http.get<SymbolMetadataModel[]>(url, { headers });
  }

  getAllSymbols(): Observable<SymbolMetadataModel[]> {
    const url = `${this.API_URL}/symbols`;

    const headers = new HttpHeaders({
      'X-CoinAPI-Key': this.API_KEY,
    });

    return this.http.get<SymbolMetadataModel[]>(url, { headers });
  }
}
