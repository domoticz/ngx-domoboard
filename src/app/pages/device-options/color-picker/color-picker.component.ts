import { Component, AfterViewInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';

import iro from '@jaames/iro';

@Component({
  selector: 'nd-color-picker',
  template: `
    <nb-card>
      <nb-card-body>
        <span class="title">{{ title }}</span>
        <div class="color-picker-container" #container></div>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ColorPickerComponent implements AfterViewInit {

  @ViewChild('container', { static: true }) container: ElementRef;

  title = 'COLOR & BRIGHTNESS:';

  colorPicker: any;

  constructor() { }

  ngAfterViewInit() {
    this.colorPicker = new iro.ColorPicker(this.container.nativeElement, {
      wheelAngle: 0,
    });
    this.colorPicker.on('color:change', this.onColorChange);
  }

  onColorChange(color, changes) {
    console.log(color.hsl);
  }

}
