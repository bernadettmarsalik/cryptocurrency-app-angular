import { Component } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { handleButtonClick } from './start.component.slider';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    handleButtonClick(this.renderer, this.el);
  }
}
