import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { NbThemeService, NbToastrService, NbDialogService } from '@nebular/theme';
import { NbToastrConfig } from '@nebular/theme/components/toastr/toastr-config';

import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

import { NotificationService } from '@nd/core/services';

import { environment } from 'environments/environment';

declare let fathom: Function;

@Component({
  selector: 'nd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('updateDialog', { static: true }) updateDialog: TemplateRef<any>;

  title = environment.name;

  version = environment.version;

  showMenu: boolean;

  menuState = 'out';

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
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private update: SwUpdate,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.enableDarkTheme();
    this.notification$.subscribe();
    this.manageUpdate();
    this.router.events.pipe(
      filter(evt => evt instanceof NavigationEnd),
      tap(() => fathom('trackPageview')),
      filter(() => this.showMenu),
      tap(() => this.onMenuToggle())
    ).subscribe();
  }

  enableDarkTheme() {
    this.themeService.changeTheme('custom-cosmic');
  }

  manageUpdate() {
    this.update.available.subscribe(() =>
      this.dialogService.open(this.updateDialog, { context: 'Reload to apply changes', hasBackdrop: true })
    );
  }

  closeDialog() {
    window.location.reload();
  }

  onMenuToggle() {
    if (!this.showMenu) {
      this.menuState = 'in';
      this.showMenu = true;
    } else {
      this.menuState = 'out';
      setTimeout(() => {
        this.showMenu = false;
        this.cd.detectChanges();
      }, 400);
    }
  }

}
