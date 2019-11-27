import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  OnInit
} from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { finalize, takeUntil, filter, switchMap, take } from 'rxjs/operators';

import { TempGraphData, Temp } from '@nd/core/models';
import { DeviceHistoryService } from '@nd/core/services';

@Component({
  selector: 'nd-history',
  template: `
    <nb-card>
      <nb-card-body>
        <div class="header">
          <span class="title">{{ title }}</span>
          <nb-select
            *ngIf="isTemp(device)"
            [selected]="range"
            id="history-select"
            (selectedChange)="onSelectedChange($event)"
          >
            <nb-option *ngFor="let _range of ranges" [value]="_range">
              {{ _range }}
            </nb-option>
          </nb-select>
        </div>

        <nd-temp-graph
          *ngIf="isTemp(device)"
          [tempData]="tempData$ | async"
          [loading]="tempLoading"
          [range]="range"
        >
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

  title = 'HISTORY';

  ranges = ['day', 'month', 'year'];

  range = 'day';

  tempLoading: boolean;

  get tempData$(): Observable<TempGraphData[]> {
    return this.service.select<any[]>('tempGraph', this.range);
  }

  constructor(private service: DeviceHistoryService) {}

  ngOnInit() {
    if (this.isTemp(this.device)) {
      this.tempLoading = true;
      this.service
        .getTempGraph(this.device.idx, this.range)
        .pipe(
          finalize(() => (this.tempLoading = false)),
          take(1),
          takeUntil(this.unsubscribe$)
        )
        .subscribe();
    }
  }

  onSelectedChange(range: string) {
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
  }

  isTemp(device: any): device is Temp {
    return device.Temp !== undefined;
  }

  ngOnDestroy() {
    this.service.clearStore();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
