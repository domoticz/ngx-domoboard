import { Component, AfterViewInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input } from '@angular/core';

import iro from '@jaames/iro';
import { DomoticzColor } from '@nd/core/models/domoticz-color.interface';

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

  @Input() color: DomoticzColor;

  @Input() lightness: number;

  title = 'COLOR & BRIGHTNESS:';

  colorPicker: any;

  constructor() { }

  ngAfterViewInit() {
    this.colorPicker = new iro.ColorPicker(this.container.nativeElement, {
      wheelAngle: 0,
    });
    this.colorPicker.on('color:change', this.onColorChange);
    if (!!this.color) {
      const { m, t, cw, ww, ...color } = this.color;
      this.colorPicker.color.set(color);
    }
    if (!!this.lightness) {
      this.colorPicker.color.setChannel('hsl', 'l', this.lightness);
    }
  }

  onColorChange(color, changes) {
    console.log(color.hsl.l);
  }

}
