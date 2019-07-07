import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Temp, Switch, DomoticzSettings } from '@nd/core/models';

@Component({
  selector: 'nd-notifications',
  template: `
    <div class="notifs-container">
      <span class="title">{{ title }}</span>
      <div class="btn-container">
        <button nbButton status="primary" (click)="onSubscribeClick()">
          {{ !isSubscribed ? 'Subscribe' : 'Unsubscribe' }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./push-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushNotificationsComponent implements OnInit {

  @Input() device: Switch | Temp;

  @Input() settings: DomoticzSettings;

  @Input() isSubscribed: boolean;

  @Input() pushSubscription: PushSubscription;

  @Output() subscribeClick = new EventEmitter<any>();

  @Output() checkSubscription = new EventEmitter<string>();

  title = 'PUSH NOTIFICATIONS:';

  ngOnInit() {
    if (!!this.pushSubscription) {
      this.checkSubscription.emit(this.pushSubscription.endpoint);
    }
  }

  onSubscribeClick() {
    this.subscribeClick.emit({
      device: this.device,
      isSubscribed: this.isSubscribed,
      settings: this.settings,
      pushEndpoint: this.pushSubscription.endpoint
    });
  }

}
