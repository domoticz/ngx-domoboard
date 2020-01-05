import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Temp, Switch, DomoticzSettings } from '@nd/core/models';

@Component({
  selector: 'nd-notifications',
  template: `
    <nb-card>
      <nb-card-body>
        <div class="notifs-container">
          <span class="title">{{ title }}</span>
          <div class="btn-container">
            <button
              nbButton
              status="primary"
              (click)="onSubscribeClick()"
              [nbSpinner]="loading"
            >
              {{ !isSubscribed ? 'Subscribe' : 'Unsubscribe' }}
            </button>
          </div>
        </div>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./push-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushNotificationsComponent {
  @Input() device: Switch | Temp;

  @Input() settings: DomoticzSettings;

  @Input() isSubscribed: boolean;

  @Input() pushSubscription: PushSubscription;

  @Input() loading: boolean;

  @Output() subscribeClick = new EventEmitter<any>();

  title = 'PUSH NOTIFICATIONS (on status change):';

  onSubscribeClick() {
    this.subscribeClick.emit({
      device: this.device,
      isSubscribed: this.isSubscribed,
      settings: this.settings,
      pushSubscription: this.pushSubscription
    });
  }
}
