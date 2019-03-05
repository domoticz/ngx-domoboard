import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nd-status-card',
  styleUrls: ['./status-card.component.scss'],
  templateUrl: './status-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusCardComponent {

  @Input() title: string;

  @Input() type: string;

  @Input() on: boolean;

  @Output() statusChanged = new EventEmitter<string>();

  switchLight() {
    this.on = !this.on;
    this.statusChanged.emit(this.on ? 'On' : 'Off');
  }

}
