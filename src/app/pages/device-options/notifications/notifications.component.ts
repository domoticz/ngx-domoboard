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
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent {

  title = 'PUSH NOTIFICATIONS:';

  readonly VAPID_PUBLIC_KEY = 'BJoU2Li1UuV8A1t3FuCbINwWv3f5BHjkZvGJqWwPWSbsjc4X2o60koBzDuka2B8oZeoTJKkAvK-hPpPtDnH7Lps';

  constructor(private swPush: SwPush) { }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => console.log(sub))
    .catch(err => console.error('Could not subscribe to notifications', err));
  }

}
