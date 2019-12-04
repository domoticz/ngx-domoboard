import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';

import { SwitchLog } from '@nd/core/models';

export interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

@Component({
  selector: 'nd-switch-logs',
  template: `
    <div class="logs--container" [nbSpinner]="loading">
      <span class="logs--title-last">{{ lastTitle }}</span>

      <nd-logs-table
        *ngIf="lastLog"
        class="logs--table-container"
        [logsData]="[lastLog]"
        [columns]="logColumns"
      ></nd-logs-table>

      <a
        *ngIf="treeSample && treeSample.length"
        class="logs--text-more"
        (click)="onMoreClick()"
        >{{ moreText }}</a
      >

      <div
        *ngIf="sample && treeSample && treeSample.length"
        class="logs--sample-container logs--sample-{{ sampleAnimation.slide }}"
      >
        <nb-icon
          [icon]="'arrow-ios-back-outline'"
          [ngClass]="{ active: isBackActive }"
          (click)="onArrowClick('back')"
        ></nb-icon>
        <nd-logs-table
          class="logs--table-container logs--sample-{{ sampleAnimation.state }}"
          [logsData]="treeSample"
          [columns]="logColumns"
        ></nd-logs-table>
        <nb-icon
          [icon]="'arrow-ios-forward-outline'"
          [ngClass]="{ active: isForwardActive }"
          (click)="onArrowClick('forward')"
        ></nb-icon>
      </div>

      <div *ngIf="logs && logs.length" class="logs--btn-container">
        <button
          type="reset"
          nbButton
          outline
          status="primary"
          (click)="clearClick.emit()"
        >
          clear logs
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./switch-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchLogsComponent {
  @Input() doorContact: boolean;

  _logs: SwitchLog[];
  @Input()
  set logs(value) {
    if (value && value.length) {
      const _value: TreeNode<any>[] = value.map(v => {
        return {
          data: {
            ...v,
            date: this.getLogDate(new Date(v.Date)),
            Time: this.getLogTime(new Date(v.Date)),
            Status: this.doorContact
              ? v.Status === 'On'
                ? 'Open'
                : 'Closed'
              : v.Status
          }
        };
      });
      this.treeLogs = _value.reduce((acc, curr) => {
        const date = curr.data.date;
        let node = acc.find(n => n.data.Date === date);
        const child = { ...curr, data: { ...curr.data, Date: '' } };
        if (!node) {
          node = {
            data: { Date: date },
            children: [child]
          };
          acc.push(node);
        } else {
          acc.splice(acc.indexOf(node), 1, {
            ...node,
            children: [...node.children, child]
          });
        }
        return acc;
      }, []);
      this.lastLog = this.treeLogs && this.treeLogs.shift();
      this.sampleRange = [0, 4];
    } else {
      this.treeLogs = [];
      this.lastLog = null;
      this.treeSample = null;
    }
    this._logs = value;
  }
  get logs() {
    return this._logs;
  }

  @Input() loading: boolean;

  @Output() clearClick = new EventEmitter();

  treeLogs: TreeNode<any>[];

  treeSample: TreeNode<any>[];

  lastLog: TreeNode<any>;

  logColumns: string[] = ['Date', 'Time', 'Status'];

  sample = false;

  sampleAnimation = {
    state: 'appear',
    slide: 'slidedown'
  };

  _sampleRange: number[];
  set sampleRange(value: number[]) {
    this.treeSample = this.treeLogs && this.treeLogs.slice(value[0], value[1]);
    this._sampleRange = value;
  }
  get sampleRange() {
    return this._sampleRange;
  }

  get lastTitle(): string {
    return `${this.lastLog ? 'last' : 'no'} logs`;
  }

  get moreText(): string {
    return `See ${this.sample ? 'less' : 'more'}...`;
  }

  get isBackActive(): boolean {
    return this.sampleRange[0] > 0;
  }

  get isForwardActive(): boolean {
    return this.sampleRange[1] <= this.treeLogs.length - 1;
  }

  constructor(private cd: ChangeDetectorRef) {}

  getLogDate(date: Date) {
    return `${date.getFullYear()}-${this.formatDate(
      date.getMonth() + 1
    )}-${this.formatDate(date.getDate())}`;
  }

  getLogTime(date: Date) {
    return `${this.formatDate(date.getHours())}:${this.formatDate(
      date.getMinutes()
    )}:${this.formatDate(date.getSeconds())}`;
  }

  formatDate(num: number) {
    return num.toString().length < 2 ? `0${num}` : num;
  }

  onMoreClick() {
    if (!this.sample) {
      this.sample = !this.sample;
      this.sampleAnimation = {
        state: 'appear',
        slide: 'slidedown'
      };
    } else {
      this.sampleAnimation = {
        state: 'disappear',
        slide: 'slideup'
      };
      setTimeout(() => {
        this.sample = !this.sample;
        this.cd.detectChanges();
      }, 400);
    }
  }

  onArrowClick(dir: string) {
    if (dir === 'back' && this.isBackActive) {
      this.sampleRange = this.sampleRange.map(value => value - 4);
    } else if (dir === 'forward' && this.isForwardActive) {
      this.sampleRange = this.sampleRange.map(value => value + 4);
    }
  }
}
