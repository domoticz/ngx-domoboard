import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SwPush } from '@angular/service-worker';

import { Observable, Subject, merge, zip } from 'rxjs';
import { takeUntil, finalize, take, switchMap, tap } from 'rxjs/operators';

import { DeviceOptionsService, DBService } from '@nd/core/services';
import { Temp, Switch, DomoticzSettings } from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';

const isSwitch = (device: any): device is Switch => device.SwitchType !== undefined;

@Component({
  selector: 'nd-device-options',
  template: `
    <div *ngIf="(device$ | async) as device" class="options-container">
      <nb-icon class="close-icon" icon="close-outline"
        (click)="onCloseClick()">
      </nb-icon>
      <nd-name [device]="device$ | async" [loading]="renameLoading"
        (nameClick)="onRenameClick($event)">
      </nd-name>
      <nd-notifications *ngIf="notificationsSupport" [device]="device$ | async"
        [settings]="settings$ | async" [isSubscribed]="isSubscribed$ | async"
        (subscribeClick)="onSubscribeClick($event)" [pushEndpoint]="pushEndpoint$ | async"
        [loading]="pushLoading">
      </nd-notifications>
    </div>
  `,
  styleUrls: ['./device-options.component.scss']
})
export class DeviceOptionsComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  device$: Observable<Temp | Switch> = this.service.select<Temp | Switch>('device').pipe(
    tap(device => this.notificationsSupport = 'Notification' in window && isSwitch(device))
  );

  isSubscribed$: Observable<boolean> = this.service.select<boolean>('isSubscribed');

  settings$ = this.dbService.select<DomoticzSettings>('settings');

  pushEndpoint$ = this.dbService.select<string>('pushEndpoint');

  renameLoading: boolean;

  pushLoading: boolean;

  readonly VAPID_PUBLIC_KEY = 'BG-zibiw-dk6bhrbwLMicGYXna-WwoNqsF8FLKdDUzqhOKvfrH3jYG-UnaYNss45AMDqfJC_GgskDpx8lycjQ0Y';

  notificationsSupport: boolean;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: DeviceOptionsService<Temp | Switch>,
    private dbService: DBService,
    private swPush: SwPush
  ) { }

  ngOnInit() {
    this.pushLoading = true;
    zip(
      this.route.paramMap,
      this.pushEndpoint$
    ).pipe(
      switchMap(([params, pushEndpoint]) => {
        return merge(
          this.service.getDevice(params.get('idx')),
          this.service.isSubscribed(params.get('idx'), pushEndpoint)
        );
      }),
      finalize(() => this.pushLoading = false),
      take(2)
    ).subscribe();
  }

  onCloseClick() {
    this.location.back();
  }

  onRenameClick(device: Temp | Switch) {
    this.renameLoading = true;
    this.service.renameDevice(device.idx, device.Name).pipe(
      take(1),
      finalize(() => this.renameLoading = false),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  async onSubscribeClick(event: any) {
    this.pushLoading = true;
    if (!event.isSubscribed) {
      try {
        const pushSub: PushSubscription =
          await this.swPush.requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY });
        const payload = {
          device: event.device,
          statusUrl: `${event.settings.ssl ? 'https' : 'http'}://` +
            `${event.settings.domain}:${event.settings.port}/${Api.device.replace('{idx}', event.device.idx)}`,
          sub: pushSub
        };
        this.service.subscribeToNotifications(payload).pipe(take(1)).subscribe();
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
      this.service.stopSubscription(event.device.idx, event.pushEndpoint).pipe(
        finalize(() => this.pushLoading = false),
        take(1)
      ).subscribe();
    }
  }

  ngOnDestroy() {
    this.service.clearStore();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
