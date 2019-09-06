import { Component, ChangeDetectionStrategy, ViewChild, ElementRef,
  OnDestroy, Input, OnInit} from '@angular/core';

import { TempGraphData } from '@nd/core/models';
import { DeviceHistoryService } from '@nd/core/services';
import { take, finalize, takeWhile, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbTabComponent } from '@nebular/theme';

@Component({
  selector: 'nd-history',
  template: `
    <nb-card>
      <nb-card-body>
        <div class="header">
          <span class="title">{{ title }}</span>
          <nb-select [(selected)]="range">
            <nb-option *ngFor="let _range of ranges" value="_range">
              {{ _range }}
            </nb-option>
          </nb-select>
        </div>
        <nd-temp-graph [tempData]="tempDayData$ | async" [loading]="dayLoading">
        </nd-temp-graph>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnDestroy {

  private unsubscribe$ = new Subject();

  @Input()
  set idx(value: string) {
    if (!!value) {
      this.dayLoading = true;
      this.service.getTempGraph(value, 'day').pipe(
        finalize(() => this.dayLoading = false),
        take(1),
        takeUntil(this.unsubscribe$)
      ).subscribe();
    }
  }

  tempDayData$ = this.service.select<TempGraphData[]>('tempGraph', 'day');

  title = 'HISTORY';

  ranges = ['day', 'month', 'year'];

  range = 'day';

  dayLoading: boolean;

  constructor(private service: DeviceHistoryService) { }

  onChangeTab(tab: NbTabComponent) {
    console.log(tab);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
