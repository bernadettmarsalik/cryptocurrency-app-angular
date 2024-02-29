import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HistoricalDataModel } from '../models/HistoricalData.model';
import { SymbolMetadataModel } from '../models/SymbolMetadata.model';
import { popularCoins } from '../../assets/popularCoins';

@Injectable({
  providedIn: 'root',
})
export class JsonService {
  private readonly API_JSON_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getHistoricalData(symbol_id: string): Observable<HistoricalDataModel[]> {
    const url = `${this.API_JSON_URL}/historicalData/`;
    return this.http.get<HistoricalDataModel[]>(url);
  }

  getSymbolsDataForWallet(wallet: string[]): Observable<any[]> {
    const observables: Observable<any>[] = wallet.map((symbol_id) =>
      this.getHistoricalData(symbol_id)
    );
    return forkJoin(observables);
  }

  getUserSymbols(userSymbols: string): Observable<SymbolMetadataModel[]> {
    const filterSymbolId = 'COINBASE_SPOT';
    const url = `${this.API_JSON_URL}/symbols`;
    return this.http.get<SymbolMetadataModel[]>(url);
  }

  getAllSymbols(): Observable<SymbolMetadataModel[]> {
    const filterSymbolId = 'COINBASE_SPOT';
    const url = `${this.API_JSON_URL}/symbols?filter_symbol_id=${filterSymbolId}&filter_asset_id=USD`;
    return this.http.get<SymbolMetadataModel[]>(url);
  }

  saveSymbols() {}
}
