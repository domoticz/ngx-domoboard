import { Component, AfterViewInit, ChangeDetectionStrategy, ViewChild,
  ElementRef, Input, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, tap, takeUntil } from 'rxjs/operators';

import iro from '@jaames/iro';

import { DomoticzColor } from '@nd/core/models';
import { kelvinTable } from './kelvin-table';

@Component({
  selector: 'nd-color-picker',
  template: `
    <nb-card>
      <nb-card-body class="card-body-container">
        <nb-tabset fullWidth class="tabset-container">
          <nb-tab #colorTab tabTitle="Color & Brightness" tabIcon="color-picker-outline" responsive>
            <div class="color-picker-container" #container></div>
          </nb-tab>

          <nb-tab #tempTab tabTitle="Temperature" tabIcon="thermometer-outline" responsive>
            <div class="slider-container">
              <input #myRange type="range" step="100" min="1000" max="12000" [value]="kelvin"
                class="slider" id="myRange" (input)="onRangeInput(myRange.value)">
            </div>
          </nb-tab>
        </nb-tabset>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  private unsubscribe$ = new Subject();

  private debouncer$ = new Subject<DomoticzColor>();

  @ViewChild('container', { static: false }) container: ElementRef;

  private _color: DomoticzColor;
  @Input()
  set color(value: DomoticzColor) {
    this.colorInit(value);
    this.kelvinInit(value);
    this._color = value;
  }
  get color() { return this._color; }

  @Input() level: number;

  @Output() colorSet = new EventEmitter<DomoticzColor>();

  colorPicker: any;

  tempActive: boolean;

  colorActive: boolean;

  kelvin: number;

  ngOnInit() {
    this.debouncer$.pipe(
      debounceTime(100),
      tap(value => this.colorSet.emit(value)),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  async ngAfterViewInit() {
    this.colorPicker = await this.colorPickerInit();
    this.colorInit();
    this.colorPicker.on('input:change', this.onColorChange.bind(this));
  }

  async colorPickerInit() {
    return new iro.ColorPicker(this.container.nativeElement);
  }

  colorInit(_color?: DomoticzColor) {
    const { m, t, cw, ww, ...color } = _color || this.color;
    if (!!this.colorPicker) {
      const lum = !!_color ? 1 : this.level / 100;
      this.colorPicker.color.set({
        r: color.r * lum,
        g: color.g * lum,
        b: color.b * lum
      });
    }
  }

  kelvinInit(_color: DomoticzColor) {
    const _c = _color || this.color;
    const _k = kelvinTable.find(k => (k.r <= _c.r + 1 && k.r >= _c.r - 1) &&
      (k.g <= _c.g + 1 && k.g >= _c.g - 1) && (k.b <= _c.b + 1 && k.b >= _c.b - 1));
    if (!!_k) {
      this.kelvin =  _k.kelvin;
    }
  }

  onColorChange(color: any) {
    this.debouncer$.next({ m: 3, t: 0, ...color.rgb, cw: 0, ww: 0 } as DomoticzColor);
  }

  onRangeInput(value: string) {
    const { kelvin, ...color } = kelvinTable.find(x => x.kelvin.toString() === value);
    this.debouncer$.next({ m: 3, t: 0, ...color, cw: 0, ww: 0 } as DomoticzColor);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
