import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DataService } from './data.service';
import { DBService } from './db.service';
import { DeviceOptionsService } from './device-options.service';

import { environment } from 'environments/environment';

import { DomoticzSettings } from '../models';

import { Api } from '../enums/api.enum';

const pushApi = {
  server: environment.pushServer,
  monitor: '/monitor-device',
  stop: '/stop-monitoring',
  isMonitoring: '/is-monitoring'
};

const VAPID_PUBLIC_KEY =
  'BG-zibiw-dk6bhrbwLMicGYXna-WwoNqsF8FLKdDUzqhOKvfrH3jYG-UnaYNss45AMDqfJC_GgskDpx8lycjQ0Y';

@Injectable({ providedIn: 'root' })
export class PushSubscriptionService extends DataService {
  get settings() {
    let settings: DomoticzSettings;
    const getSettings = async () => {
      settings = await this.dbService
        .select<DomoticzSettings>('settings')
        .toPromise();
    };
    getSettings();
    return settings;
  }

  get pushSubscription() {
    let pushSubscription: PushSubscription;
    const getPushSubscription = async () => {
      pushSubscription = await this.dbService
        .select<PushSubscription>('pushSubscription')
        .toPromise();
      if (!pushSubscription) {
        pushSubscription = await this.swPush.requestSubscription({
          serverPublicKey: VAPID_PUBLIC_KEY
        });
      }
    };
    getPushSubscription();
    return pushSubscription;
  }

  constructor(
    httpClient: HttpClient,
    dbService: DBService,
    private optionsService: DeviceOptionsService,
    private swPush: SwPush
  ) {
    super(httpClient, dbService);
  }

  async getPushSubscription() {
    const pushDb = await this.dbService
      .select<PushSubscription>('pushSubscription')
      .toPromise();
    if (!pushDb) {
      const pushSub = await this.swPush.requestSubscription({
        serverPublicKey: VAPID_PUBLIC_KEY
      });
      return pushSub;
    }
    return pushDb;
  }

  async getSettings() {
    const settings = await this.dbService
      .select<DomoticzSettings>('settings')
      .toPromise();
    return settings;
  }

  isSubscribed(
    device: any,
    pushSubscription: PushSubscription
  ): Observable<any> {
    return this.httpClient
      .post<boolean>(`${pushApi.server}${pushApi.isMonitoring}`, {
        device,
        pushSubscription
      })
      .pipe(
        tap((resp: any) => {
          if (resp.status === 'OK') {
            this.optionsService.syncIsSubscribed(resp.isMonitoring);
          }
        })
      );
  }

  subscribeToNotifications(device: any): Observable<any> {
    const payload = {
      device: device,
      statusUrl:
        `${this.settings.ssl ? 'https' : 'http'}://` +
        `${this.settings.domain}:${this.settings.port}/${Api.device.replace(
          '{idx}',
          device.idx
        )}`,
      sub: this.pushSubscription
    };
    return this.httpClient
      .post(`${pushApi.server}${pushApi.monitor}`, payload)
      .pipe(
        tap(async (resp: any) => {
          if (resp.status === 'OK') {
            this.optionsService.syncIsSubscribed(true);
            try {
              const msg = await this.dbService.addPushSub(
                this.pushSubscription
              );
              this.dbService.syncPushSub(this.pushSubscription);
              console.log('😃 ' + msg);
            } catch (error) {
              this.dbService.syncPushSub(null);
              console.log('⛔️ ' + error);
            }
          }
        })
      );
  }

  stopSubscription(
    device: any,
    pushSubscription: PushSubscription
  ): Observable<any> {
    return this.httpClient
      .post<boolean>(`${pushApi.server}${pushApi.stop}`, {
        device,
        pushSubscription
      })
      .pipe(
        tap((resp: any) => {
          if (resp.status === 'OK') {
            this.optionsService.syncIsSubscribed(false);
          }
        })
      );
  }
}
