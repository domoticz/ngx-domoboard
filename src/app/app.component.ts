import { Component, OnInit } from '@angular/core';

import { NbThemeService } from '@nebular/theme';

import { Observable } from 'rxjs';

import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'nd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ngx-domoboard';

  notification$: Observable<string> = this.notifService.notification;

  constructor(
    private themeService: NbThemeService,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    this.enableDarkTheme();
  }

  enableDarkTheme() {
    this.themeService.changeTheme('cosmic');
  }

  onClose() {
    this.notifService.clearNotification();
  }

}
