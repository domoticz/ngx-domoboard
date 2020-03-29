import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nd-device-icon',
  template: `
  <nb-card>
    <nb-card-body>
      <div class="icon-container">
        <div class="icon-form-container">
          <span class="title">{{ title }}<a href="https://akveo.github.io/eva-icons/#/">eva icons</a>): </span>
          <div class="icon-form" [nbSpinner]="loading">
            <input class="icon-input" nbInput type="text" placeholder="eva icon label"
              [(ngModel)]="evaIcon">
            <button class="icon-btn" nbButton status="primary" (click)="onSaveIconClick()">
              <nb-icon icon="checkmark-outline"></nb-icon>
            </button>
          </div>
        </div>
      </div>
    </nb-card-body>
  </nb-card>
  `,
  styleUrls: ['./device-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DeviceIconComponent {

  @Input() idx: string;

  @Input() loading: boolean;

  private _deviceIcon: string;
  @Input()
  set deviceIcon(value) {
    this.evaIcon = value;
  }
  get deviceIcon() { return this._deviceIcon; }

  @Output() saveIconClick = new EventEmitter<any>();

  title = 'Icon (link to ';

  evaIcon: string;

  onSaveIconClick() {
    this.saveIconClick.emit({ idx: this.idx, evaIcon: this.evaIcon });
  }

}
