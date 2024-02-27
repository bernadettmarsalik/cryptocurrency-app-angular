import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../../services/crypto.service';
import { SignUp } from '../../../models/SignUp.model';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements OnInit {
  loggedUser?: SignUp;

  cryptos: any[] = [];

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    this.loadCryptos();
    this.cryptoService.getListOfCryptos().subscribe(
      (data) => {
        this.cryptos = data;
        console.log('Cryptos:', this.cryptos);
      },
      (error) => {
        console.error('Error fetching cryptos:', error);
      }
    );
  }
  loadCryptos() {
    // Szolgáltatás segítségével töltsd be a kriptovaluta adatokat
    this.cryptoService.getListOfCryptos().subscribe(
      (data) => {
        this.cryptos = data; // A szerviz által visszaadott adatokat a cryptocurrencies tömbbe mentheted
      },
      (error) => {
        console.error('Error loading cryptos:', error);
      }
    );
  }
  viewDetails(crypto: any) {
    // Egyéb részletek megjelenítése, pl. modális ablak vagy navigáció
    console.log('View details for:', crypto);
  }

  deleteCrypto(crypto: any) {
    // Kriptovaluta törlése, pl. megerősítés után vagy egyedi logika alapján
    console.log('Delete crypto:', crypto);
  }
}
