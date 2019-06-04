import { Component, OnInit } from '@angular/core';

import { NbThemeService, NbToastrService } from '@nebular/theme';

import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

import { NotificationService } from '@nd/core/services';

import { NbToastrConfig } from '@nebular/theme/components/toastr/toastr-config';
import { environment } from 'environments/environment';

@Component({
  selector: 'nd-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  title = environment.name;

  version = environment.version;

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
    this.themeService.changeTheme('custom-cosmic');
  }

}
