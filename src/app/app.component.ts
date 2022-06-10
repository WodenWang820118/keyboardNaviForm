import { Component, HostListener, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'keyNavigation';
  key: string = '';
  selectedInput: string = '';

  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  maxSection = this.numbers[this.numbers.length - 1];
  sections: FormControl = new FormControl(0);

  constructor(private renderer: Renderer2) {
  }

  getSelection(event: any) {
    let newValue = event.value;
    this.udpateSections(newValue);
  }

  udpateSections(newValue: number): void {
    this.sections.setValue(newValue);
  }

  // must be attached together to handle the keydown event
  // @See https://stackoverflow.com/questions/37362488/how-can-i-listen-for-keypress-event-on-the-whole-page

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
    // get the focused element and based on the element and the key pressed to determined which element should be focused next
    let currentInput = this.selectedInput;
    let currentInputIdx = Number(currentInput.split('-')[1]);
    let currentInputField = currentInput.split('-')[0];

    console.log(currentInputIdx);
    console.log(currentInputField);

    // TODO: should blur the mouse focus
    this.renderer.selectRootElement(`.${currentInputField}-${currentInputIdx}`).blur();

    switch (this.key) {
      case 'ArrowUp':
        console.log(`Up`);
        if (currentInputIdx > 0) {
          this.setFocus(`.${currentInputField}-${currentInputIdx - 1}`)
        }
        break;
      case 'ArrowDown':
        console.log(`Down`);
        (currentInputIdx < this.sections.value - 1) ? this.setFocus(`.${currentInputField}-${currentInputIdx + 1}`) : '';
        break;
      case 'ArrowLeft':
        console.log(`Left`);
        switch (currentInputField) {
          case 'speed':
            break;
          case 'pressure':
            this.setFocus(`.speed-${currentInputIdx}`);
            break;
          case 'position':
            this.setFocus(`.pressure-${currentInputIdx}`);
            break;
        }
        break;
      case 'ArrowRight':
        console.log(`Right`);
        switch (currentInputField) {
          case 'speed':
            this.setFocus(`.pressure-${currentInputIdx}`);
            break;
          case 'pressure':
            this.setFocus(`.position-${currentInputIdx}`);
            break;
          case 'position':
            break;
        }
        break;
      default:
        console.log(`Not going to handle this key: ${this.key}`);
    }
  }

  setFocus(selector: string) {
    console.log(`Try to focus on ${selector}`);
    this.renderer.selectRootElement(selector).focus();
  }

  handleFocus(event: any) {
    let className = event.target.className;
    let classNameArr = className.split(' ');

    // use dynamic class names to loop up for the specific input element
    for (let name of classNameArr) {
      let field = name.split('-')[0];
      let idx = Number(name.split('-')[1]);
      if (field === 'speed' ||
          field === 'pressure' ||
          field === 'position') {
        this.selectedInput = name;
        break;
      }
    }
  }
}
