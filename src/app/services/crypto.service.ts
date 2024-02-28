import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

    const headers = new HttpHeaders({
      'X-CoinAPI-Key': this.API_KEY,
    });

    return this.http.get<any>(url, { headers });
  }

  getAllSymbols(): Observable<any> {
    const url = `${this.API_URL}/symbols`;

    const headers = new HttpHeaders({
      'X-CoinAPI-Key': this.API_KEY,
    });

    return this.http.get<any>(url, { headers });
  }
}

// // Kriptovaluta hozzáadása
// addCrypto(selectedCrypto: string): Observable<any> {
//   // Implementáld a hozzáadást, például a local storage-ba is elmentheted
//   // Ebben a példában csak egy observable-t adok vissza, itt lehet az API hívás a hozzáadáshoz
//   return new Observable((observer) => {
//     // Itt végezd el a hozzáadás logikáját, pl. local storage-ba is elmentheted
//     observer.next({ success: true });
//     observer.complete();
//   });
// }

// // Kriptovaluta törlése
// deleteCrypto(cryptoId: string): Observable<any> {
//   // Implementáld a törlést, például a local storage-ból is törölheted
//   // Ebben a példában csak egy observable-t adok vissza, itt lehet az API hívás a törléshez
//   return new Observable((observer) => {
//     // Itt végezd el a törlés logikáját, pl. local storage-ból is törölheted
//     observer.next({ success: true });
//     observer.complete();
//   });
// }

// // Elmúlt heti árfolyam lekérése
// getWeeklyPrice(cryptoId: string): Observable<any> {
//   const url = `${this.API_URL}/ohlcv/${cryptoId}/USD/history?period_id=1W`; // Az utolsó egy hét adatai
//   return this.http.get(url, { headers: { 'X-CoinAPI-Key': this.API_KEY } });
// }
