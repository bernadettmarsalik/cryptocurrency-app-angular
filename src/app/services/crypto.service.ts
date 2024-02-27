import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CryptoModel } from '../models/Crypto.model';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly API_KEY: string = '4E8C07B5-B5DA-4AC4-B8D4-3B9A9E2358B9';
  private readonly API_URL = 'https://api.coinapi.io/v1';

  constructor(private http: HttpClient) {}

  getHistoricalData(symbolId: string): Observable<any> {
    const apiUrl = `${this.API_URL}/ohlcv/${symbolId}/USD/history`;
    // Itt a szükséges API hívást tudod végrehajtani
    return this.http.get(apiUrl);
  }

  getListOfSymbols(): Observable<any> {
    const apiUrl = `${this.API_URL}/symbols`;
    // Itt a szükséges API hívást tudod végrehajtani
    return this.http.get(apiUrl);
  }
}
