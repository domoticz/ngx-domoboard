import { Component, AfterViewInit, ChangeDetectionStrategy, ViewChild,
  ElementRef, Input, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, tap, takeUntil } from 'rxjs/operators';

import iro from '@jaames/iro';

import { DomoticzColor } from '@nd/core/models';

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

export class ColorPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  private unsubscribe$ = new Subject();

  private debouncer$ = new Subject<DomoticzColor>();

  @ViewChild('container', { static: true }) container: ElementRef;

  @Input() color: DomoticzColor;

  @Input() level: number;

  @Output() colorSet = new EventEmitter<DomoticzColor>();

  title = 'COLOR & BRIGHTNESS:';

  colorPicker: any;

  ngOnInit() {
    this.debouncer$.pipe(
      debounceTime(100),
      tap(value => this.colorSet.emit(value)),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  async ngAfterViewInit() {
    this.colorPicker = await this.colorPickerInit();
    await this.colorInit();
    this.colorPicker.on('color:change', this.onColorChange.bind(this));
  }

  async colorPickerInit() {
    return new iro.ColorPicker(this.container.nativeElement);
  }

  async colorInit() {
    if (!!this.color) {
      const { m, t, cw, ww, ...color } = this.color;
      this.colorPicker.color.set({
        r: color.r * this.level / 100,
        g: color.g * this.level / 100,
        b: color.b * this.level / 100
      });
    }
  }

  onColorChange(color: any) {
    this.debouncer$.next({ m: 3, t: 0, ...color.rgb, cw: 0, ww: 0 } as DomoticzColor);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
