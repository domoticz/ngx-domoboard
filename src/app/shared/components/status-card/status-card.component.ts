import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'nd-status-card',
  styleUrls: ['./status-card.component.scss'],
  templateUrl: './status-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusCardComponent {

  @Input() title: string;

  @Input() type: string;

  @Input() on = true;

  switchLight() {
    this.on = !this.on;
  }

}
