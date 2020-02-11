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
import { tap, filter, switchMap, take } from 'rxjs/operators';

import {
  NotificationService,
  DBService,
  PushSubscriptionService,
  ThemeSelectService
} from '@nd/core/services';

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

  selectedTheme$ = this.dbService.select<string>('selectedTheme');

  themes = [
    { label: 'Cosmic (legacy)', theme: 'custom-cosmic' },
    { label: 'Cosmic', theme: 'cosmic' },
    { label: 'Light', theme: 'default' },
    { label: 'Dark', theme: 'dark' }
  ];

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

  monitoredDevices$ = this.dbService.select<any[]>('monitoredDevices');

  constructor(
    private themeService: NbThemeService,
    private notifService: NotificationService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private update: SwUpdate,
    private cd: ChangeDetectorRef,
    private router: Router,
    readonly swPush: SwPush,
    private dbService: DBService,
    private pushService: PushSubscriptionService,
    private themeSelectService: ThemeSelectService
  ) {}

  ngOnInit() {
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
    this.enableTheme();
  }

  enableTheme() {
    this.selectedTheme$
      .pipe(tap((theme: string) => this.themeService.changeTheme(theme)))
      .subscribe();
  }

  async saveTheme(theme: string) {
    try {
      const msg = await this.themeSelectService.saveTheme(theme);
      console.log('🖌 ' + msg);
    } catch (error) {
      console.error('⛔️ ' + error);
    }
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
        switchMap(() => this.monitoredDevices$),
        switchMap(devices => {
          if (devices && devices.length) {
            return this.pushService.initSubscriptions();
          }
        })
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
