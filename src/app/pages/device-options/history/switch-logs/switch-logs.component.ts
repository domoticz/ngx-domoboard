import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

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
      <nd-logs-table
        class="logs--table-container"
        [logsData]="[lastLog]"
        [columns]="logColumns"
      ></nd-logs-table>
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
      this.lastLog = this.treeLogs.shift();
      this.treeSample = this.treeLogs.slice(this.sampleStart, this.sampleEnd);
    }
  }
  get logs() {
    return this._logs;
  }

  @Input() loading: boolean;

  treeLogs: TreeNode<any>[];

  treeSample: TreeNode<any>[];

  lastLog: TreeNode<any>;

  logColumns: string[] = ['Date', 'Time', 'Status'];

  sampleStart = 1;

  sampleEnd = 5;

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
}
