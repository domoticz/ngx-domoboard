import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nd-status-card',
  template: `
    <nb-card (click)="switchLight()" [ngClass]="{'off': !on, 'disabled': disabled,
      'no-event': !clickable}" [nbSpinner]="loading">

      <div class="icon-container">
        <div class="icon primary">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title">{{ title }}</div>
        <div class="status">{{ status }}</div>
      </div>

      <nb-icon class="option-icon" icon="plus-outline"
        (click)="onOptionsClick($event)">
      </nb-icon>

    </nb-card>
  `,
  styleUrls: ['./status-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusCardComponent {

  @Input() title: string;

  @Input() type: string;

  @Input() on: boolean;

  @Input() disabled: boolean;

  @Input() loading: boolean;

  private _status: string;
  @Input()
  set status(value: string) {
    this.clickable = ['On', 'Off'].includes(value);
    this._status = value;
  }
  get status() { return this._status; }

  @Output() statusChanged = new EventEmitter<string>();

  @Output() optionsClick = new EventEmitter();

  clickable: boolean;

  switchLight() {
    this.statusChanged.emit(this.on ? 'Off' : 'On');
  }

  onOptionsClick(evt: any) {
    evt.stopPropagation();
    this.optionsClick.emit();
  }

}
