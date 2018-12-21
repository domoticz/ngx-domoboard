import { Component, Input } from '@angular/core';

@Component({
  selector: 'nd-status-card',
  styleUrls: ['./status-card.component.scss'],
  templateUrl: './status-card.component.html'
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() type: string;
  @Input() on = true;
}
