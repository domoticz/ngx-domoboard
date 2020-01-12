import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SwUpdate, SwPush } from '@angular/service-worker';

import {
  NbThemeService,
  NbToastrService,
  NbDialogService
} from '@nebular/theme';
import { NbToastrConfig } from '@nebular/theme/components/toastr/toastr-config';

import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

import { NotificationService, DBService } from '@nd/core/services';

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
    tap(message =>
      this.toastrService.show(message, null, {
        position: 'bottom-right',
        status: 'danger',
        duration: 5000
      } as NbToastrConfig)
    )
  );

  constructor(
    private themeService: NbThemeService,
    private notifService: NotificationService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private update: SwUpdate,
    private cd: ChangeDetectorRef,
    private router: Router,
    readonly swPush: SwPush,
    private dbService: DBService
  ) {}

  ngOnInit() {
    this.enableDarkTheme();
    this.notification$.subscribe();
    this.manageUpdate();
    this.managePushNotifications();
    this.router.events
      .pipe(
        filter(evt => evt instanceof NavigationEnd),
        tap(() => {
          if (environment.production && !environment.domoticz) {
            fathom('trackPageview');
          }
        }),
        filter(() => this.showMenu),
        tap(() => this.onMenuToggle())
      )
      .subscribe();
    this.dbService.openDb().then(() => {
      this.dbService.syncSettings();
      this.dbService.syncPushSub(null);
    });
  }

  enableDarkTheme() {
    this.themeService.changeTheme('custom-cosmic');
  }

  manageUpdate() {
    this.update.available.subscribe(() =>
      this.dialogService.open(this.updateDialog, {
        context: 'Reload to apply changes',
        hasBackdrop: true
      })
    );
  }

  managePushNotifications() {
    this.swPush.messages
      .pipe(
        filter((msg: any) => msg.notification.body === '🔥 Push server up!'),
        tap(msg => console.log(msg))
      )
      .subscribe();
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
