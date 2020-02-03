import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TreeNode } from './switch-logs.component';

@Component({
  selector: 'nd-logs-table',
  template: `
    <table [nbTreeGrid]="logsData" equalColumnsWidth>
      <tr nbTreeGridHeaderRow *nbTreeGridHeaderRowDef="columns"></tr>
      <tr nbTreeGridRow *nbTreeGridRowDef="let row; columns: columns"></tr>

      <ng-container
        *ngFor="let column of columns"
        [nbTreeGridColumnDef]="column"
      >
        <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>
          {{ column }}
        </th>
        <td nbTreeGridCell *nbTreeGridCellDef="let row">
          <div class="logs--cell-container">
            <nb-icon
              *ngIf="column === 'Date' && row.data.Date"
              class="logs--cell-icon"
              [icon]="
                !row.expanded ? 'arrow-right-outline' : 'arrow-down-outline'
              "
            ></nb-icon>
            {{ row.data[column] }}
          </div>
        </td>
      </ng-container>
    </table>
  `,
  styles: [
    `
      .logs--cell-container {
        display: flex;
      }
      .logs--cell-icon {
        cursor: pointer;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsTableComponent {
  @Input() logsData: TreeNode<any>;

  @Input() columns: string[];

  constructor() {}
}
