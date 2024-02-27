import { Component, OnInit } from '@angular/core';
import { TabService } from '../../../services/tab.service';
import { CryptoService } from '../../../services/crypto.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrl: './crypto.component.scss',
})
export class CryptoComponent implements OnInit {
  tabs: string[] = [];

  constructor(
    private tabService: TabService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {
    this.tabService.tabs$.subscribe((tabs) => {
      this.tabs = tabs;
    });
  }

  addTab(tabName: string) {
    this.tabService.addTab(tabName);
  }

  removeTab(tabName: string) {
    this.tabService.removeTab(tabName);
  }
}
