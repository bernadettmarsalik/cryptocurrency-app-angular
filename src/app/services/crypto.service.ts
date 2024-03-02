import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, tap, throwError } from 'rxjs';
import { SymbolMetadataModel } from '../models/SymbolMetadata.model';
import { HistoricalDataModel } from '../models/HistoricalData.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly API_KEY: string = '4E8C07B5-B5DA-4AC4-B8D4-3B9A9E2358B9';
  private readonly API_URL = 'http://api.coinapi.io/v1';
  private readonly headers = {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'X-CoinAPI-Key': '4E8C07B5-B5DA-4AC4-B8D4-3B9A9E2358B9',
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHistoricalData(cryptoId: string): Observable<HistoricalDataModel[]> {
    let symbolId = `BITSTAMP_SPOT_${cryptoId}_USD`;
    const url = `http://api.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_${cryptoId}_USD/history?period_id=1DAY&limit=7`;

    return this.http.get<HistoricalDataModel[]>(url, { headers: this.headers });
  }

  getHistoricalDataByExchange(cryptoId: string) {
    const url = `${this.API_URL}/exchangerate/${cryptoId}/USD/history?period_id=7DAY`;
  }

  getSymbolsDataForWallet(wallet: string[]): Observable<any[]> {
    const observables: Observable<any>[] = wallet.map((symbol_id) =>
      this.getHistoricalData(symbol_id)
    );
    return forkJoin(observables);
  }

  getAllSymbols(): Observable<SymbolMetadataModel[]> {
    // A túl sok kérés miatt és 429 status miatt limitálni kellett a lekért adatot
    const filterExchange = 'BITSTAMP';

    const url = `${this.API_URL}/symbols/${filterExchange}?filter_asset_id=USD`;

    return this.http.get<SymbolMetadataModel[]>(url, { headers: this.headers });
  }

  saveSymbols() {}

  // Delete
  onDelete(symbol_id: string): void {
    const user = this.authService.getLoggedUser();

    if (user) {
      console.log(user.wallet + 'wallet before delete');
      if (user.wallet.includes(symbol_id)) {
        const removeIndex = user.wallet.indexOf(symbol_id);
        console.log('remove symbolid' + removeIndex);
        user.wallet.splice(removeIndex, 1);
        console.log(user.wallet + 'wallet after delete');
        confirm(`Are you sure you want to delete crypto ${symbol_id}`);
        this.authService.updateUser(user);
        console.log('Crypto deleted succesfully.');
      } else {
        alert('User not found. Please log in again.');
      }
    }
  }

  // Váltó
  getExchangeRate(
    assetIdBase: string,
    assetIdQuote: string
  ): Observable<number> {
    const url = `https://rest.coinapi.io/v1/exchangerate/${assetIdBase}/${assetIdQuote}`;

    return this.http.get<any>(url, { headers: this.headers }).pipe(
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
