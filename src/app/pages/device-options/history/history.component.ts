import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  OnInit
} from '@angular/core';

import { Subject, Observable } from 'rxjs';
import {
  finalize,
  takeUntil,
  filter,
  switchMap,
  take,
  share
} from 'rxjs/operators';

import { TempGraphData, HumGraphData, Temp, Hum, Switch, SwitchLog } from '@nd/core/models';
import { DeviceHistoryService } from '@nd/core/services';

const isSwitch = (device: any): device is Switch => device.SwitchType !== undefined;
const isTemp = (device: any): device is Temp => device.Temp !== undefined;
const isHum = (device: any): device is Hum => device.Humidity !== undefined;


@Component({
  selector: 'nd-history',
  template: `
    <nb-card>
      <nb-card-body>
        <div class="header">
          <span class="title">{{ title }}</span>

          <nb-select
            *ngIf="(tempData$ | async).length"
            [selected]="range"
            id="history-select"
            (selectedChange)="onSelectedChange($event)">
            <nb-option *ngFor="let _range of ranges" [value]="_range">
              {{ _range }}
            </nb-option>
          </nb-select>

          <nb-select
            *ngIf="(humData$ | async).length"
            [selected]="range"
            id="history-select"
            (selectedChange)="onSelectedChange($event)">
            <nb-option *ngFor="let _range of ranges" [value]="_range">
              {{ _range }}
            </nb-option>
          </nb-select>
        </div>

        <nd-temp-graph
          *ngIf="device.Temp"
          [tempData]="tempData$ | async"
          [loading]="tempLoading"
          [range]="range">
        </nd-temp-graph>

        <nd-hum-graph
        *ngIf="device.Humidity"
          [humData]="humData$ | async"
          [loading]="humLoading"
          [range]="range">
        </nd-hum-graph>

        <nd-switch-logs
          *ngIf="device.SwitchType"
          [logs]="switchLogs$ | async"
          [loading]="logsLoading"
          [doorContact]="device.SwitchType === 'Door Contact'"
          (clearClick)="onClearClick()" >
        </nd-switch-logs>

      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();

  @Input() device: any;

  title = 'History';

  ranges = ['day', 'month', 'year'];

  range = 'day';

  tempLoading: boolean;
  humLoading: boolean;
  logsLoading: boolean;

  get tempData$(): Observable<TempGraphData[]> {
    return this.service
      .select<TempGraphData[]>('tempGraph', this.range)
      .pipe(share());
  }

  get humData$(): Observable<HumGraphData[]> {
    return this.service
      .select<HumGraphData[]>('humGraph', this.range)
      .pipe(share());
  }

  switchLogs$ = this.service.select<SwitchLog[]>('switchLogs');

  constructor(private service: DeviceHistoryService) { }

  ngOnInit() {
    if (isTemp(this.device)) {
      this.tempLoading = true;
      this.service
        .getTempGraph(this.device.idx, this.range)
        .pipe(
          finalize(() => (this.tempLoading = false)),
          take(1),
          takeUntil(this.unsubscribe$)
        )
        .subscribe();
    } else if (isHum(this.device)) {
      this.humLoading = true;
      this.service
        .getHumGraph(this.device.idx, this.range)
        .pipe(
          finalize(() => (this.humLoading = false)),
          take(1),
          takeUntil(this.unsubscribe$)
        )
        .subscribe();
    } else if (isSwitch(this.device)) {
      this.logsLoading = true;
      this.service
        .getSwitchLogs(this.device.idx)
        .pipe(
          finalize(() => (this.logsLoading = false)),
          take(1),
          takeUntil(this.unsubscribe$)
        )
        .subscribe();
    }
  }

  onSelectedChange(range: string) {
    if (isTemp(this.device)) {
      this.range = range;
      this.tempData$
        .pipe(
          filter(tempData => !tempData.length),
          switchMap(() => {
            this.tempLoading = true;
            return this.service.getTempGraph(this.device.idx, this.range);
          }),
          finalize(() => (this.tempLoading = false)),
          take(1),
          takeUntil(this.unsubscribe$)
        )
        .subscribe();
    } else if (isHum(this.device)) {
      this.range = range;
      this.humData$
        .pipe(
          filter(humData => !humData.length),
          switchMap(() => {
            this.humLoading = true;
            return this.service.getHumGraph(this.device.idx, this.range);
          }),
          finalize(() => (this.humLoading = false)),
          take(1),
          takeUntil(this.unsubscribe$)
        )
        .subscribe();
    }
  }

  onClearClick() {
    this.logsLoading = true;
    this.service
      .clearSwitchLogs(this.device.idx)
      .pipe(
        finalize(() => (this.logsLoading = false)),
        take(1),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.service.clearStore();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
