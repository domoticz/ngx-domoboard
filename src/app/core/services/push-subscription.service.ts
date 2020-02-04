import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';

import { Observable } from 'rxjs';
import { tap, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { DBService } from './db.service';
import { MonitoredDeviceService } from './monitored-device.service';

import { environment } from 'environments/environment';

import { DomoticzSettings } from '../models';

import { Api } from '../enums/api.enum';

const pushApi = {
  server: environment.pushServer,
  monitor: '/monitor-device',
  stop: '/stop-monitoring',
  initMonitoring: '/init-monitoring'
};

const VAPID_PUBLIC_KEY =
  'BG-zibiw-dk6bhrbwLMicGYXna-WwoNqsF8FLKdDUzqhOKvfrH3jYG-UnaYNss45AMDqfJC_GgskDpx8lycjQ0Y';

@Injectable({ providedIn: 'root' })
export class PushSubscriptionService extends DBService {
  get dbSubject() {
    return this.dbService.subject;
  }

  settings$ = this.dbService.select<DomoticzSettings>('settings');

  pushSubscription$: Observable<PushSubscription> = this.dbService
    .select<PushSubscription>('pushSubscription')
    .pipe(
      switchMap(async (pushSubscription: PushSubscription) => {
        if (!pushSubscription) {
          pushSubscription = await this.swPush.requestSubscription({
            serverPublicKey: VAPID_PUBLIC_KEY
          });
        }
        return pushSubscription;
      })
    );

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
    return this.pushSubscription$.pipe(
      withLatestFrom(this.settings$),
      switchMap(([pushSubscription, settings]) => {
        const payload = {
          device: device,
          statusUrl:
            `${settings.ssl ? 'https' : 'http'}://` +
            `${settings.domain}:${settings.port}/${Api.device.replace(
              '{idx}',
              device.idx
            )}`,
          sub: pushSubscription
        };
        return this.httpClient
          .post(`${pushApi.server}${pushApi.monitor}`, payload)
          .pipe(
            tap(async (resp: any) => {
              if (resp.status === 'OK') {
                await this.syncWithDb('push_subscription', pushSubscription);
                await this.syncWithDb('monitored_device', device);
              }
            })
          );
      })
    );
  }

  initSubscriptions(): Observable<any> {
    return this.settings$.pipe(
      switchMap((settings: DomoticzSettings) => {
        const payload = {
          api:
            `${settings.ssl ? 'https' : 'http'}://` +
            `${settings.domain}:${settings.port}`
        };
        return this.httpClient.post(
          `${pushApi.server}${pushApi.initMonitoring}`,
          payload
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
      // pushSubscription: pushSubscription
      pushSubscription: pushSubscription.toJSON()
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
    return this.pushSubscription$.pipe(
      switchMap((pushSubscription: PushSubscription) =>
        this.httpClient
          .post<boolean>(`${pushApi.server}${pushApi.stop}`, {
            pushSubscription,
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
                const devices = await this.dbService
                  .select<any[]>('monitoredDevices')
                  .pipe(take(1))
                  .toPromise();
                if (!devices.length) {
                  try {
                    const msg = await this.clearPushSubscription();
                    console.log('😃 ' + msg);
                  } catch (error) {
                    console.log('⛔️ ' + error);
                  }
                }
              }
            })
          )
      )
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
