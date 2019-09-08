import { Component, ChangeDetectionStrategy,
  OnDestroy, Input, OnInit} from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { take, finalize, takeUntil, map } from 'rxjs/operators';

import { TempGraphData } from '@nd/core/models';
import { DeviceHistoryService } from '@nd/core/services';

@Component({
  selector: 'nd-history',
  template: `
    <nb-card>
      <nb-card-body>
        <div class="header">
          <span class="title">{{ title }}</span>

          <nb-select [(selected)]="range" id="history-select"
            (selectedChange)="onSelectedChange($event)">
            <nb-option *ngFor="let _range of ranges" [value]="_range">
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
export class HistoryComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  @Input() idx: string;

  tempDayData$: Observable<TempGraphData[]> = this.service.select<any[]>('tempGraph', 'day');

  title = 'HISTORY';

  ranges = ['day', 'month', 'year'];

  range = 'day';

  dayLoading: boolean;

  constructor(private service: DeviceHistoryService) { }

  ngOnInit() {
    this.onSelectedChange(this.range);
  }

  onSelectedChange(range: string) {
    this.dayLoading = true;
    this.service.getTempGraph(this.idx, range).pipe(
      finalize(() => this.dayLoading = false),
      take(1),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
