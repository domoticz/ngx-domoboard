import { Component, OnInit } from '@angular/core';

import { NbThemeService, NbToastrService } from '@nebular/theme';

import { Observable } from 'rxjs';

import { NotificationService } from '@nd/core/services';

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
    private notifService: NotificationService,
    private toastrService: NbToastrService
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
