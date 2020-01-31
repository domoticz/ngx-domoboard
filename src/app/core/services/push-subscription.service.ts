import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';

import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { DBService } from './db.service';
import { MonitoredDeviceService } from './monitored-device.service';

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
export class PushSubscriptionService extends DBService {
  get dbSubject() {
    return this.dbService.subject;
  }

  settings$ = this.dbService.select<DomoticzSettings>('settings');

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
    private httpClient: HttpClient,
    private dbService: DBService,
    private monitorService: MonitoredDeviceService,
    private swPush: SwPush
  ) {
    super();
  }

  getPushSubStore(mode: string) {
    return this.dbService.getObjectStore(this.PUSHSUB_STORE, mode);
  }

  subscribeToNotifications(device: any): Observable<any> {
    return this.settings$.pipe(
      switchMap((settings: DomoticzSettings) => {
        const payload = {
          device: device,
          statusUrl:
            `${settings.ssl ? 'https' : 'http'}://` +
            `${settings.domain}:${settings.port}/${Api.device.replace(
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
                await this.syncWithDb(
                  'push_subscription',
                  this.pushSubscription
                );
                await this.syncWithDb('monitored_device', device);
              }
            })
          );
      })
    );
  }

  async syncWithDb(store: string, payload: any) {
    try {
      let msg: string;
      if (store === 'push_subscription') {
        msg = await this.addPushSub(payload);
      } else if (store === 'monitored_device') {
        msg = await this.monitorService.addMonitoredDevice(payload);
      }
      console.log('😃 ' + msg);
    } catch (error) {
      console.log('⛔️ ' + error);
    }
  }

  addPushSub(pushSubscription: PushSubscription): Promise<any> {
    const store = this.getPushSubStore('readwrite');
    const req = store.put({
      id: 1,
      pushSubscription: pushSubscription
      // pushSubscription: pushSubscription.toJSON()
    });
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        this.dbSubject.next({
          ...this.dbSubject.value,
          pushSubscription: pushSubscription
        });
        resolve('addPushSub: ' + evt.type);
      }.bind(this);
      req.onerror = function(evt) {
        reject('addPushSub: ' + evt.target['error'].message);
      };
    });
  }

  syncPushSub() {
    const req = this.getPushSubStore('readonly').get(1);
    req.onsuccess = ((evt: any) => {
      const res = evt.target.result;
      this.dbSubject.next({
        ...this.dbSubject.value,
        pushSubscription: res ? res.pushSubscription : null
      });
    }).bind(this);
    req.onerror = function(evt) {
      console.log('syncPushSub: ' + evt.target['error'].message);
    };
  }

  stopSubscription(device: any): Observable<any> {
    return this.httpClient
      .post<boolean>(`${pushApi.server}${pushApi.stop}`, {
        pushSubscription: this.pushSubscription,
        device
      })
      .pipe(
        tap(async (resp: any) => {
          if (resp.status === 'OK') {
            try {
              const msg = await this.monitorService.deleteMonitoredDevice(
                device
              );
              console.log('😃 ' + msg);
            } catch (error) {
              console.log('⛔️ ' + error);
            }
            try {
              const msg = await this.clearPushSubscription();
              console.log('😃 ' + msg);
            } catch (error) {
              console.log('⛔️ ' + error);
            }
          }
        })
      );
  }

  clearPushSubscription() {
    const store = this.getPushSubStore('readwrite');
    const req = store.clear();
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        this.dbSubject.next({
          ...this.dbSubject.value,
          pushSubscription: null
        });
        resolve('clearPushSubscription: ' + evt.type);
      }.bind(this);
      req.onerror = function(evt) {
        reject('clearPushSubscription: ' + evt.target['error'].message);
      };
    });
  }
}
