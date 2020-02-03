import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'nd-status-card',
  template: `
    <nb-card
      (click)="switchLight()"
      [ngClass]="{
        off: !on,
        disabled: device.HaveTimeout,
        'no-event': !clickable
      }"
      [nbSpinner]="loading"
    >
      <div class="icon-container">
        <div class="icon primary">
          <nd-svg-icon
            *ngIf="
              !!icon[device.Image] ||
                (type === 'Door Contact' &&
                  deviceIcon === 'alert-triangle-outline');
              else nbIcon
            "
            class="nd-icon {{ device[statusKey] }}"
            [name]="icon[device.Image]"
            [status]="device[statusKey]"
          >
          </nd-svg-icon>
          <ng-template #nbIcon>
            <nb-icon class="temp-icon" [icon]="deviceIcon"> </nb-icon>
          </ng-template>
        </div>
      </div>

      <div class="details">
        <div class="title">{{ device.Name }}</div>
        <div class="status">{{ status }}</div>
      </div>

      <nb-icon
        class="option-icon"
        icon="plus-outline"
        (click)="onOptionsClick($event)"
      >
      </nb-icon>
    </nb-card>
  `,
  styleUrls: ['./status-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusCardComponent {
  @Input() device: any;

  @Input() type: string;

  @Input() statusKey: string;

  @Input()
  set deviceIcons(value: any[]) {
    const record = value.find(x => x.idx === this.device.idx);
    this.deviceIcon = record ? record.deviceIcon : 'alert-triangle-outline';
  }

  @Input() on: boolean;

  @Input() loading: boolean;

  private _status: string;
  @Input()
  set status(value) {
    if (!!value) {
      this.clickable = ['On', 'Off', 'Level'].some(s => value.includes(s));
      this._status = value;
    }
  }
  get status() {
    return this._status;
  }

  @Output() statusChanged = new EventEmitter<string>();

  @Output() optionsClick = new EventEmitter();

  clickable: boolean;

  deviceIcon: string;

  icon = {
    Fireplace: 'nd-fireplace',
    Door: 'nd-door'
  };

  switchLight() {
    this.statusChanged.emit(this.on ? 'Off' : 'On');
  }

  onOptionsClick(evt: any) {
    evt.stopPropagation();
    this.optionsClick.emit();
  }
}
