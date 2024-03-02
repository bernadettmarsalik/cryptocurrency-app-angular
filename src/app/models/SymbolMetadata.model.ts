export interface SymbolMetadataModel {
  symbol_id: string;
  exchange_id: string;
  symbol_type: string;
  asset_id_base: string;
  asset_id_quote: string;
  data_start: string;
  data_end: string;
  data_quote_start: string;
  data_quote_end: string;
  data_orderbook_start: string;
  data_orderbook_end: string;
  data_trade_start: string;
  data_trade_end: string;
  volume_1hrs: number;
  volume_1hrs_usd: number;
  volume_1day: number;
  volume_1day_usd: number;
  volume_1mth: number;
  volume_1mth_usd: number;
  price: number;
  symbol_id_exchange: string;
  asset_id_base_exchange: string;
  asset_id_quote_exchange: string;
  price_precision: number;
  size_precision: number;
}
