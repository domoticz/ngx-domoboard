import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Temp, Switch } from '@nd/core/models';

@Component({
  selector: 'nd-name',
  template: `
    <nb-card>
      <nb-card-body>
      <div class="icon-container">
        <div class="name-form-container">
          <span class="title">{{ title }}</span>
          <div class="name-form" [nbSpinner]="loading">
            <input class="name-input" nbInput type="text" [(ngModel)]="device.Name">
            <button class="name-btn" nbButton status="primary" (click)="nameClick.emit(device)">
              <nb-icon icon="checkmark-outline"></nb-icon>
            </button>
          </div>
        </div>
        </div>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NameComponent {

  @Input() loading: boolean;

  @Input() device: Temp | Switch;

  @Output() nameClick = new EventEmitter<Temp | Switch>();

  title = 'Rename ';

}
