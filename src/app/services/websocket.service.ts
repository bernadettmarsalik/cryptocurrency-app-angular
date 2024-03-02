import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HistoricalDataModel } from '../models/HistoricalData.model';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  webSocket$!: WebSocketSubject<any>;
  private readonly API_KEY: string = '4E8C07B5-B5DA-4AC4-B8D4-3B9A9E2358B9';
  private readonly API_URL = 'https://rest.coinapi.io/v1/';
  private readonly headers = {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'X-CoinAPI-Key': '4E8C07B5-B5DA-4AC4-B8D4-3B9A9E2358B9',
  };

  constructor(private http: HttpClient) {}

  getAllCrypto(): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.API_URL}symbols?filter_exchange_id=BITSTAMP&filter_asset_id=USD`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        map((result) => {
          return result.map((item: any) => item.asset_id_base);
        })
      );
  }

  getHistoricalData(cryptoId: string): Observable<any[]> {
    let symbolId = `BITSTAMP_SPOT_${cryptoId}_USD`;
    const url = `http://api.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_${cryptoId}_USD/history?period_id=1DAY&limit=7`;

    return this.http.get<any[]>(url, { headers: this.headers }).pipe(
      tap((result) => console.log('history', result)),
      map((result) => {
        return result.map((result: any) => ({
          price_close: result.price_close,
          time_close: result.time_close,
        }));
      })
    );
  }

  // low-high értékek lekérése
  gettingCurrentData(cryptoName: string): Observable<[number, string][]> {
    return this.http
      .get<any>(
        `${this.API_URL}ohlcv/BITSTAMP_SPOT_${cryptoName}_USD/latest?period_id=10SEC&limit=1`,

        {
          headers: this.headers,
        }
      )
      .pipe(
        map((result) => {
          return result.map((result: any) => ({
            price_high: result.price_high,
            price_low: result.time_low,
          }));
        })
      );
  }

  //get websocket: https://docs.coinapi.io/how-to-guides/real-time-trades-stream-using-websocket-with-different-language

  getData(cryptos: string[]): void {
    const socketUrl = 'wss://ws.coinapi.io/v1/';
    this.webSocket$ = new WebSocketSubject(socketUrl);

    const wallet: string[] = [];
    cryptos.forEach((cryptoId) => {
      wallet.push(`BITSTAMP_SPOT_${cryptoId}_USD$`);
    });

    const hello = {
      type: 'hello',
      apikey: this.API_KEY,
      heartbeat: false,
      subscribe_data_type: ['ohlcv'],
      subscribe_filter_symbol_id: wallet,
      subscribe_filter_period_id: ['1MIN'],
    };

    if (wallet.length > 0) {
      this.webSocket$.next(hello);
    }

    this.webSocket$.subscribe(
      (message) => {
        console.log(message);
      },
      (error) => console.error('Websocket error:', error)
    );

    console.log('Sending hello message:', hello);
  }

  closeSocket(): void {
    if (this.webSocket$) {
      this.webSocket$.complete();
    }
  }
}
