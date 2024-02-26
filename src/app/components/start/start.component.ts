import { Component, ElementRef, Renderer2 } from '@angular/core';
import { handleButtonClick } from './start-slider';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  hide = true;
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    handleButtonClick(this.renderer, this.el);
  }
}
