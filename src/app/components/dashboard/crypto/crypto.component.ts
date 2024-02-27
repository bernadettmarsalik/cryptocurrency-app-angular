import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
import { Router } from '@angular/router';
import { HistoricalDataModel } from '../../../models/HistoricalData.model';
import { Subscription } from 'rxjs';
import { SymbolMetadataModel } from '../../../models/SymbolMetadata.model';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrl: './crypto.component.scss',
})
export class CryptoComponent implements OnInit {
  cryptos: SymbolMetadataModel[] = [];
  subCrypto?: Subscription;
  subDeleteCrypto?: Subscription;
  id?: number;

  constructor(private cryptoService: CryptoService, private router: Router) {}

  ngOnInit(): void {
    this.getCryptos();
  }

  getCryptos() {
    this.subCrypto = this.cryptoService.getListOfCryptos().subscribe({
      next: (cryptos: SymbolMetadataModel[]) => {
        this.cryptos = cryptos;
        console.log(cryptos);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Crypto request is done!');
      },
    });
  }

  // createCrypto() {
  //   this.router.navigate(['car-form']);
  // }

  // deleteCrypto(id?: number) {
  //   if (confirm('Are you sure?')) {
  //     if (!id) {
  //       id = Number(prompt('Kérlek adj meg egy id-t a törléshez!'));
  //     }
  //     this.subDeleteCar = this.carService.deleteCar(Number(id)).subscribe({
  //       complete: () => {
  //         console.log('Delete complete!');
  //         this.getCars();
  //       },
  //     });
  //   }
  // }

  // goToCarDetails(id?: number): void {
  //   this.router.navigate(['car-form', id]);
  // }

  ngOnDestroy(): void {
    this.subCrypto?.unsubscribe();
    this.subDeleteCrypto?.unsubscribe();
  }
}
