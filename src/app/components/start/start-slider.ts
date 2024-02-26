import { Renderer2, ElementRef } from '@angular/core';

export function handleButtonClick(renderer: Renderer2, el: ElementRef): void {
  const signUpButton = el.nativeElement.querySelector('#signUp');
  const signInButton = el.nativeElement.querySelector('#signIn');
  const container = el.nativeElement.querySelector('#container');

  signUpButton.addEventListener('click', () => {
    renderer.addClass(container, 'right-panel-active');
  });

  signInButton.addEventListener('click', () => {
    renderer.removeClass(container, 'right-panel-active');
  });
}
