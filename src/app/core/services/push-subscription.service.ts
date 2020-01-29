import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';

import { Observable } from 'rxjs';
import { tap, single, first, take } from 'rxjs/operators';

import { DataService } from './data.service';
import { DBService } from './db.service';
import { DeviceOptionsService } from './device-options.service';

import { environment } from 'environments/environment';

import { DomoticzSettings } from '../models';

import { Api } from '../enums/api.enum';
import { MonitoredDeviceService } from './monitored-device.service';

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
  get settings(): any {
    return (async () =>
      await this.dbService
        .select<DomoticzSettings>('settings')
        .pipe(take(1))
        .toPromise())();
  }

  get pushSubscription() {
    // return (async () => {
    //   let pushSubscription: PushSubscription;
    //   pushSubscription = await this.dbService
    //     .select<PushSubscription>('pushSubscription')
    //     .pipe(first())
    //     .toPromise();
    //   if (!pushSubscription) {
    //     pushSubscription = await this.swPush.requestSubscription({
    //       serverPublicKey: VAPID_PUBLIC_KEY
    //     });
    //   }
    //   return pushSubscription;
    // })();
    return {
      endpoint:
        'https://fcm.googleapis.com/fcm/send/d1AHolIOEto:APA91bE5C2hXmqJTXKcL5IUPz1eYstLYJ0-o0KDBmLF1PiWZiG5_DssSnX_ACn5ZZFR3sM9IifA3a6qeyIsy-YcA8Gf-m0oXZU-8SJVMMt9Jw9792XdZnrODFBZOY__h_QuSPYbPOz3Y',
      expirationTime: null,
      keys: {
        p256dh:
          'BG6oCpRhEW9GYSh4v8lCDlgVgB3JuaYfuSNN361n1p6p6R_VvaEEfY1PPJIZbs6oDKOMkjPK6RT2mxRF9ZjR6N8',
        auth: 'eRTPXpUZE1fHp-Yh7gAfjQ'
      }
    };
  }

  constructor(
    httpClient: HttpClient,
    dbService: DBService,
    private optionsService: DeviceOptionsService,
    private monitorService: MonitoredDeviceService,
    private swPush: SwPush
  ) {
    super(httpClient, dbService);
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
            await this.syncWithDb('push_subscription', this.pushSubscription);
            await this.syncWithDb('monitored_device', device);
          }
        })
      );
  }

  async syncWithDb(store: string, payload: any) {
    try {
      let msg: string;
      if (store === 'push_subscription') {
        msg = await this.dbService.addPushSub(payload);
        this.dbService.syncPushSub(payload);
      } else if (store === 'monitored_device') {
        msg = await this.monitorService.addMonitoredDevice(payload);
      }
      console.log('😃 ' + msg);
    } catch (error) {
      if (store === 'push_subscription') {
        this.dbService.syncPushSub(null);
      }
      console.log('⛔️ ' + error);
    }
  }

  stopSubscription(device: any): Observable<any> {
    return this.httpClient
      .post<boolean>(`${pushApi.server}${pushApi.stop}`, {
        pushSubscription: this.pushSubscription
      })
      .pipe(
        tap(async (resp: any) => {
          if (resp.status === 'OK') {
            this.optionsService.syncIsSubscribed(false);
            try {
              const msg = await this.monitorService.deleteMonitoredDevice(
                device
              );
              console.log('😃 ' + msg);
            } catch (error) {
              console.log('⛔️ ' + error);
            }
          }
        })
      );
  }
}
