import { Component, ChangeDetectionStrategy,
  OnDestroy, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import { Subject, Observable, from } from 'rxjs';
import { take, finalize, takeUntil, mergeMap } from 'rxjs/operators';

import { TempGraphData, Temp } from '@nd/core/models';
import { DeviceHistoryService } from '@nd/core/services';

@Component({
  selector: 'nd-history',
  template: `
    <nb-card>
      <nb-card-body>

          <div class="header">
            <span class="title">{{ title }}</span>
            <nb-select *ngIf="isTemp(device)" [(selected)]="range" id="history-select">
              <nb-option *ngFor="let _range of ranges" [value]="_range">
                {{ _range }}
              </nb-option>
            </nb-select>
          </div>

          <nd-temp-graph *ngIf="isTemp(device) && range === 'day'"
            [tempData]="tempDayData$ | async" [loading]="tempLoading"
            [range]="range">
          </nd-temp-graph>

          <nd-temp-graph *ngIf="isTemp(device) && range === 'month'"
            [tempData]="tempMonthData$ | async" [loading]="tempLoading"
            [range]="range">
          </nd-temp-graph>

          <nd-temp-graph *ngIf="isTemp(device) && range === 'year'"
            [tempData]="tempYearData$ | async" [loading]="tempLoading"
            [range]="range">
          </nd-temp-graph>

      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  @Input() device: any;

  tempDayData$: Observable<TempGraphData[]> = this.service.select<any[]>('tempGraph', 'day');

  tempMonthData$: Observable<TempGraphData[]> = this.service.select<any[]>('tempGraph', 'month');

  tempYearData$: Observable<TempGraphData[]> = this.service.select<any[]>('tempGraph', 'year');

  title = 'HISTORY';

  ranges = ['day', 'month', 'year'];

  range = 'day';

  tempLoading: boolean;

  constructor(
    private service: DeviceHistoryService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.tempLoading = true;
    from(this.ranges).pipe(
      mergeMap(range => this.service.getTempGraph(this.device.idx, range)),
      finalize(() => {
        this.tempLoading = false;
        this.cd.detectChanges();
      }),
      take(this.ranges.length),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  isTemp(device: any): device is Temp {
    return device.Temp !== undefined;
  }

  onSelectedChange(event: any) {

  }

  ngOnDestroy() {
    this.service.clearStore();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
