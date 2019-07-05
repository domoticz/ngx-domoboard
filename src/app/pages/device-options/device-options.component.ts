import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { SwPush } from '@angular/service-worker';

import { Observable, Subject, concat } from 'rxjs';
import { switchMap, takeUntil, finalize, take, concatMap } from 'rxjs/operators';

import { DeviceOptionsService, DBService } from '@nd/core/services';
import { Temp, Switch, DomoticzSettings } from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';

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
      <nd-notifications [device]="device$ | async" [settings]="settings$ | async"
        [isSubscribed]="isSubscribed$ | async" (subscribeClick)="onSubscribeClick($event)">
      </nd-notifications>
    </div>
  `,
  styleUrls: ['./device-options.component.scss']
})
export class DeviceOptionsComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  device$: Observable<Temp | Switch> = this.service.select<Temp | Switch>('device');

  isSubscribed$: Observable<boolean> = this.service.select<boolean>('isSubscribed');

  settings$: Observable<DomoticzSettings> = this.dbService.store;

  renameLoading: boolean;

  readonly VAPID_PUBLIC_KEY = 'BG-zibiw-dk6bhrbwLMicGYXna-WwoNqsF8FLKdDUzqhOKvfrH3jYG-UnaYNss45AMDqfJC_GgskDpx8lycjQ0Y';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: DeviceOptionsService<Temp | Switch>,
    private dbService: DBService,
    private swPush: SwPush
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      concatMap((params: ParamMap) => this.service.getDevice(params.get('idx'))),
      concatMap(() => this.service.isSubscribed()),
      takeUntil(this.unsubscribe$)
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

  onSubscribeClick(event: any) {
    if (!event.isSubscribed) {
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(sub => {
        const payload = {
          device: event.device,
          statusUrl: `${event.settings.ssl ? 'https' : 'http'}://` +
            `${event.settings.domain}:${event.settings.port}/${Api.device.replace('{idx}', event.device.idx)}`,
          sub: sub
        };
        this.service.subscribeToNotifications(payload).pipe(take(1)).subscribe();
      })
      .catch(err => console.error('Could not subscribe to notifications', err));
    } else {
      this.service.stopSubscription(event.device.idx).pipe(take(1)).subscribe();
    }
  }

  ngOnDestroy() {
    this.service.clearStore();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
