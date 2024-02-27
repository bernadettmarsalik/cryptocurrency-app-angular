export interface CryptoModel {
  symbol_id: string;
  time_period_start: string;
  time_period_end: string;
  time_open: string;
  time_close: string;
  price_open: number;
  price_high: number;
  price_low: number;
  price_close: number;
  volume_traded: number;
  trades_count: number;
}

export interface SymbolMetadata {
  symbol_id: string;
  symbol_type: string;
  exchange_id: string;
  asset_id_base: string;
  asset_id_quote: string;
}
