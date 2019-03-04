import { Injectable, NgZone } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private subject = new BehaviorSubject<string>(null);
  notification = this.subject.asObservable();

  constructor(private zone: NgZone) { }

  notify(message: string, duration?: number) {
    this.zone.run(() => {
      this.subject.next(message);
      if (!!duration) { setTimeout(() => this.clearNotification(), duration); }
    });
  }

  clearNotification() {
    this.subject.next(null);
  }

}
