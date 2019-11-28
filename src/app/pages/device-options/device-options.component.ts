import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';
import { SwPush } from '@angular/service-worker';

import { Observable, Subject, zip } from 'rxjs';
import { takeUntil, finalize, take, tap, mergeMap, map } from 'rxjs/operators';

import { DeviceOptionsService, DBService } from '@nd/core/services';
import {
  Temp,
  Switch,
  DomoticzSettings,
  DomoticzColor,
  DomoticzResponse,
  TempGraphData
} from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';

import { environment } from 'environments/environment';

const isSwitch = (device: any): device is Switch =>
  device.SwitchType !== undefined;
const isTemp = (device: any): device is Temp => device.Temp !== undefined;

@Component({
  selector: 'nd-device-options',
  template: `
    <div class="options-container {{ appearanceState }}">
      <nb-icon class="close-icon" icon="close-outline" (click)="onCloseClick()">
      </nb-icon>

      <ng-container *ngIf="device$ | async as device">
        <div class="small-blocks">
          <nd-name
            [device]="device"
            [loading]="renameLoading"
            (nameClick)="onRenameClick($event)"
            class="col-xxxl-3 col-md-6 small-block"
          >
          </nd-name>

          <nd-device-icon
            [idx]="device.idx"
            [deviceIcon]="deviceIcon$ | async"
            (saveIconClick)="onSaveIconClick($event)"
            [loading]="iconLoading"
            class="col-xxxl-3 col-md-6 small-block"
          >
          </nd-device-icon>

          <nd-notifications
            *ngIf="notificationsSupport"
            [device]="device"
            [settings]="settings$ | async"
            [isSubscribed]="isSubscribed$ | async"
            (subscribeClick)="onSubscribeClick($event)"
            [pushEndpoint]="pushEndpoint$ | async"
            [loading]="pushLoading"
            class="col-xxxl-3 col-md-6 small-block"
          >
          </nd-notifications>

          <nd-dim-level
            *ngIf="(isDimmer$ | async) && device.Type !== 'Color Switch'"
            [device]="device"
            (levelSet)="onLevelSet($event)"
            class="col-xxxl-3 col-md-6 small-block"
          >
          </nd-dim-level>
        </div>

        <div class="big-blocks">
          <nd-color-picker
            *ngIf="device.Type === 'Color Switch'"
            [color]="color$ | async"
            [level]="level$ | async"
            (colorSet)="onColorSet(device.idx, $event)"
          >
          </nd-color-picker>

          <nd-history [device]="device"></nd-history>
        </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./device-options.component.scss']
})
export class DeviceOptionsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();

  device$: Observable<Temp | Switch> = this.service.select<Temp | Switch>(
    'device'
  );

  color$: Observable<DomoticzColor> = this.service
    .select<string>('device', 'Color')
    .pipe(map((color: string) => JSON.parse(color) as DomoticzColor));

  isSubscribed$: Observable<boolean> = this.service.select<boolean>(
    'isSubscribed'
  );

  settings$ = this.dbService.select<DomoticzSettings>('settings');

  pushEndpoint$ = this.dbService.select<string>('pushEndpoint');

  deviceIcon$ = this.dbService.select<string>('deviceIcon');

  renameLoading: boolean;

  pushLoading: boolean;

  iconLoading: boolean;

  readonly VAPID_PUBLIC_KEY =
    'BG-zibiw-dk6bhrbwLMicGYXna-WwoNqsF8FLKdDUzqhOKvfrH3jYG-UnaYNss45AMDqfJC_GgskDpx8lycjQ0Y';

  notificationsSupport: boolean;

  appearanceState = 'appear';

  previousUrl: UrlSegment[] = this.router.getCurrentNavigation().extras.state
    .previousUrl;

  get isTemp$(): Observable<boolean> {
    return this.device$.pipe(map(device => isTemp(device)));
  }

  get isDimmer$(): Observable<boolean> {
    return this.device$.pipe(
      map(device => isSwitch(device) && device.SwitchType === 'Dimmer')
    );
  }

  get level$(): Observable<number> {
    return this.device$.pipe(map(device => isSwitch(device) && device.Level));
  }

  constructor(
    private service: DeviceOptionsService,
    private dbService: DBService,
    private swPush: SwPush,
    private router: Router
  ) {}

  ngOnInit() {
    this.device$
      .pipe(
        tap(device => {
          this.notificationsSupport =
            'Notification' in window &&
            isSwitch(device) &&
            !environment.domoticz;
          this.dbService.syncDeviceIcon(device.idx, null);
        }),
        take(1),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
    this.pushLoading = true;
    zip(this.device$, this.pushEndpoint$)
      .pipe(
        mergeMap(([device, pushEndpoint]) =>
          this.service.isSubscribed(device.idx, pushEndpoint)
        ),
        finalize(() => (this.pushLoading = false)),
        take(1),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  onCloseClick() {
    this.appearanceState = 'disappear';
    this.router.navigate([`devices/${this.previousUrl[0].path}`]);
  }

  onRenameClick(device: Temp | Switch) {
    this.renameLoading = true;
    this.service
      .renameDevice(device.idx, device.Name)
      .pipe(
        take(1),
        finalize(() => (this.renameLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  async onSaveIconClick(event: any) {
    try {
      this.iconLoading = true;
      const msg = await this.dbService.addDeviceIcon(event.idx, event.evaIcon);
      console.log('😃 ' + msg);
      this.dbService.syncDeviceIcon(event.idx, event.evaIcon);
      setTimeout(() => (this.iconLoading = false), 500);
    } catch (error) {
      console.error('⛔️ Could not save device icon', error);
    }
  }

  async onSubscribeClick(event: any) {
    this.pushLoading = true;
    if (!event.isSubscribed) {
      try {
        const pushSub: PushSubscription = await this.swPush.requestSubscription(
          { serverPublicKey: this.VAPID_PUBLIC_KEY }
        );
        const payload = {
          device: event.device,
          statusUrl:
            `${event.settings.ssl ? 'https' : 'http'}://` +
            `${event.settings.domain}:${
              event.settings.port
            }/${Api.device.replace('{idx}', event.device.idx)}`,
          sub: pushSub
        };
        this.service
          .subscribeToNotifications(payload)
          .pipe(take(1))
          .subscribe();
        try {
          const msg = await this.dbService.addPushSub(pushSub.endpoint);
          this.dbService.syncPushSub(pushSub.endpoint);
          console.log(msg);
        } catch (error) {
          this.dbService.syncPushSub(null);
          console.log(error);
        }
      } catch (error) {
        console.error('Could not subscribe to notifications', error);
      } finally {
        this.pushLoading = false;
      }
    } else {
      this.service
        .stopSubscription(event.device.idx, event.pushEndpoint)
        .pipe(
          take(1),
          finalize(() => (this.pushLoading = false)),
          takeUntil(this.unsubscribe$)
        )
        .subscribe();
    }
  }

  onLevelSet(device: Switch) {
    this.service
      .setDimLevel(device.idx, device.Level)
      .pipe(take(1), takeUntil(this.unsubscribe$))
      .subscribe();
  }

  onColorSet(idx: string, event: DomoticzColor) {
    this.service
      .setColorBrightness(idx, event)
      .pipe(
        tap((resp: DomoticzResponse<Switch>) => {
          if (resp.status === 'OK') {
            this.service.syncColor(event);
          }
        }),
        take(1),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.service.clearStore();
  }
}
