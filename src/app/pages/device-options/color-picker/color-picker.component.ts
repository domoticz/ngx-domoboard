import { Component, AfterViewInit, ChangeDetectionStrategy, ViewChild,
  ElementRef, Input, EventEmitter, OnInit, OnDestroy, Output, ChangeDetectorRef } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, tap, takeUntil } from 'rxjs/operators';

import iro from '@jaames/iro';

import { DomoticzColor } from '@nd/core/models';
import { NbTabComponent } from '@nebular/theme';

@Component({
  selector: 'nd-color-picker',
  template: `
    <nb-card>
      <nb-card-body class="card-body-container">
        <nb-tabset fullWidth class="tabset-container" (changeTab)="onChangeTab($event)">
          <nb-tab #colorTab tabTitle="Color & Brightness" tabIcon="color-picker-outline" responsive
            class="{{ colorTab.active ? 'active' : 'inactive' }}">
            <div *ngIf="colorActive" class="color-picker-container" #container></div>
          </nb-tab>

          <nb-tab #tempTab tabTitle="Temperature" tabIcon="thermometer-outline" responsive
            class="{{ tempTab.active ? 'active' : 'inactive' }}">
            <div *ngIf="true" class="slider-container">
              <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
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

  @ViewChild('container', { static: true }) container: ElementRef;

  @Input() color: DomoticzColor;

  @Input() level: number;

  @Output() colorSet = new EventEmitter<DomoticzColor>();

  colorPicker: any;

  tempActive: boolean;

  colorActive: boolean;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.debouncer$.pipe(
      debounceTime(100),
      tap(value => this.colorSet.emit(value)),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  async ngAfterViewInit() {
    // this.colorPicker = await this.colorPickerInit();
    // await this.colorInit();
    // this.colorPicker.on('color:change', this.onColorChange.bind(this));
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

  onChangeTab(tab: NbTabComponent) {
    console.log(tab);
    if (tab.tabTitle === 'Temperature') {
      this.colorActive = false;
      setTimeout(() => {
        this.tempActive = true;
        this.cd.detectChanges();
      }, 1000);
    } else if (tab.tabTitle === 'Color & Brightness') {
      this.tempActive = false;
      setTimeout(() => {
        this.colorActive = true;
        this.cd.detectChanges();
      }, 1000);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
