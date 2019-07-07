import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

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
export class PushNotificationsComponent {

  @Input() device: Switch | Temp;

  @Input() settings: DomoticzSettings;

  @Input() isSubscribed: boolean;

  private _pushEndpoint: string;
  @Input()
  set pushEndpoint(value) {
    if (!!value) {
      this.checkSubscription.emit(value);
      this._pushEndpoint = value;
    }
  }
  get pushEndpoint() { return this._pushEndpoint; }

  @Output() subscribeClick = new EventEmitter<any>();

  @Output() checkSubscription = new EventEmitter<string>();

  title = 'PUSH NOTIFICATIONS:';

  onSubscribeClick() {
    this.subscribeClick.emit({
      device: this.device,
      isSubscribed: this.isSubscribed,
      settings: this.settings,
      pushEndpoint: this.pushEndpoint
    });
  }

}
