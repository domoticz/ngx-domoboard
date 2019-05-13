import { Component, OnInit } from '@angular/core';

import { NbThemeService, NbToastrService } from '@nebular/theme';

import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

import { NotificationService } from '@nd/core/services';

import { NbToastrConfig } from '@nebular/theme/components/toastr/toastr-config';

@Component({
  selector: 'nd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ngx-domoboard';

  notification$: Observable<string> = this.notifService.notification.pipe(
    filter(message => !!message),
    tap(message => this.toastrService.show(
      message, null, { position: 'bottom-right', status: 'danger', duration: 5000 } as NbToastrConfig
      )
    )
  );

  constructor(
    private themeService: NbThemeService,
    private notifService: NotificationService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.enableDarkTheme();
    this.notification$.subscribe();
  }

  enableDarkTheme() {
    this.themeService.changeTheme('cosmic');
  }

  onClose() {
    this.notifService.clearNotification();
  }

}
