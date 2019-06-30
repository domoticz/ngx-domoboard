import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'nd-notifications',
  template: `
    <div class="notifs-container">
      <span class="title">{{ title }}</span>
      <div class="btn-container">
        <button nbButton status="primary" (click)="subscribeToNotifications()">
          Subscribe
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./push-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushNotificationsComponent {

  title = 'PUSH NOTIFICATIONS:';

  readonly VAPID_PUBLIC_KEY = 'BG-zibiw-dk6bhrbwLMicGYXna-WwoNqsF8FLKdDUzqhOKvfrH3jYG-UnaYNss45AMDqfJC_GgskDpx8lycjQ0Y';

  constructor(private swPush: SwPush) { }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => console.log(sub))
    .catch(err => console.error('Could not subscribe to notifications', err));
  }

}
