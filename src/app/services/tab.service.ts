import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private tabs: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  tabs$: Observable<string[]> = this.tabs.asObservable();

  addTab(tabName: string) {
    const currentTabs = this.tabs.getValue();
    const updatedTabs = [...currentTabs, tabName];
    this.tabs.next(updatedTabs);
  }

  removeTab(tabName: string) {
    const currentTabs = this.tabs.getValue();
    const updatedTabs = currentTabs.filter((tab) => tab !== tabName);
    this.tabs.next(updatedTabs);
  }
  constructor() {}
}
