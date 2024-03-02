import { WebsocketService } from './../../../services/websocket.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { SignUp } from '../../../models/SignUp.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss'],
})
export class WebsocketComponent implements OnInit, OnDestroy {
  websocketData: { cryptoId: string; high?: number; low?: number }[] = [];
  user?: SignUp;
  wallet: string[] = [];
  isOpen: boolean = true;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private webSocketService: WebsocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedUser();

    if (this.user && this.user.wallet.length > 0) {
      this.wallet = this.user.wallet;

      this.websocketData =
        this.wallet?.map((crypto) => ({ cryptoId: crypto })) || [];

      this.websocketData.forEach((crypto) => {
        this.webSocketService
          .gettingCurrentData(crypto.cryptoId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((currentData: any) => {
            crypto.high = currentData.price_high;
            crypto.low = currentData.price_low;
          });
      });
    }

    this.onGetData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.onClose();
  }

  // adatlekérés a websocketről
  onGetData() {
    this.isOpen = true;

    this.webSocketService.getData(this.wallet!);
    this.webSocketService.webSocket$
      .pipe(
        map((message) => {
          console.log(message);
          const cryptoId = message.symbol_id
            .replace('BITSTAMP_SPOT_', '')
            .replace('_USD', '');
          let high = message.price_high;
          let low = message.price_low;

          this.webSocketService
            .gettingCurrentData(cryptoId)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
              next: (data: any) => {
                high = data.price_high;
                low = data.price_low;
              },
              error: (err) => console.log(err),
            });

          return { cryptoId: cryptoId, high: high, low: low };
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (message) => {
          const changeData = this.websocketData.find(
            (crypto) => crypto.cryptoId === message.cryptoId
          );
          if (!changeData) {
            this.websocketData.push({
              cryptoId: message.cryptoId,
              high: message.high,
              low: message.low,
            });
          } else {
            changeData!.high = message.high;
            changeData!.low = message.low;
          }
        },
        (error) => {
          console.log('Websocket error:', error);
        },
        () => {
          console.log('Websocket closed');
          if (this.isOpen) {
            // If still open, restart the connection
            this.onGetData();
          }
        }
      );
  }

  onClose() {
    this.isOpen = false;
    this.webSocketService.closeSocket();
  }
}
