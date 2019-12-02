import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { SwitchLog } from '@nd/core/models';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

@Component({
  selector: 'nd-switch-logs',
  template: `
    <div class="logs-container" [nbSpinner]="loading">
      <table [nbTreeGrid]="[lastLog]" equalColumnsWidth>
        <tr nbTreeGridHeaderRow *nbTreeGridHeaderRowDef="logColumns"></tr>
        <tr nbTreeGridRow *nbTreeGridRowDef="let row; columns: logColumns"></tr>

        <ng-container
          *ngFor="let column of logColumns"
          [nbTreeGridColumnDef]="column"
        >
          <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>
            {{ column }}
          </th>
          <td nbTreeGridCell *nbTreeGridCellDef="let row">
            {{ row.data[column] }}
          </td>
        </ng-container>
      </table>
    </div>
  `,
  styleUrls: ['./switch-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchLogsComponent {
  _logs: SwitchLog[];
  @Input()
  set logs(value) {
    if (value && value.length) {
      const _value: TreeNode<any>[] = value.map(v => {
        return {
          data: {
            ...v,
            date: this.getLogDate(new Date(v.Date)),
            time: this.getLogTime(new Date(v.Date))
          }
        };
      });
      // this.treeLogs = _value.reduce((acc, curr) => {
      //   const date = curr.data.date;
      //   if (!acc)
      // }, []);
      this.lastLog = { data: value.shift() };
    }
  }
  get logs() {
    return this._logs;
  }

  @Input() loading: boolean;

  treeLogs: TreeNode<any>[];

  lastLog: TreeNode<any>;

  logColumns: string[] = ['Date', 'Status'];

  getLogDate(date: Date) {
    return `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()}`;
  }

  getLogTime(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
}
