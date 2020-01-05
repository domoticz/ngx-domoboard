import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

import { DomoticzSettings } from '@nd/core/models';

interface State {
  settings: DomoticzSettings;
  pushSubscription: PushSubscription;
  deviceIcon: string;
}

@Injectable({ providedIn: 'root' })
export class DBService {
  private subject = new BehaviorSubject<State>({} as State);
  store = this.subject
    .asObservable()
    .pipe(
      distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
    );

  db: IDBDatabase;

  DB_NAME = 'NDDB';

  DB_VERSION = 1;

  SETTINGS_STORE = 'domoticz_settings';

  PUSHSUB_STORE = 'push_subscription';

  ICON_STORE = 'device_icon';

  select<T>(...name: string[]): Observable<T> {
    return this.store.pipe(pluck(...name));
  }

  openDb(): Promise<any> {
    const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt) {
        resolve((this.db = evt.target.result));
      }.bind(this);

      req.onerror = function(evt) {
        reject('openDb: ' + evt.target['error'].message);
      };

      req.onupgradeneeded = function(evt) {
        evt.currentTarget['result'].createObjectStore(this.SETTINGS_STORE, {
          keyPath: 'id'
        });
        evt.currentTarget['result'].createObjectStore(this.PUSHSUB_STORE, {
          keyPath: 'id'
        });
        evt.currentTarget['result'].createObjectStore(this.ICON_STORE, {
          keyPath: 'idx'
        });
      }.bind(this);
    });
  }

  getObjectStore(store_name, mode) {
    const tx = this.db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  addSettings(settings: DomoticzSettings): Promise<any> {
    const store = this.getObjectStore(this.SETTINGS_STORE, 'readwrite');
    try {
      if (
        !!Object.keys(settings.credentials).every(
          key => settings.credentials[key] !== null
        )
      ) {
        const authToken = btoa(
          `${settings.credentials.username}:${settings.credentials.password}`
        );
        settings.authToken = authToken;
        delete settings.credentials;
      }
    } catch (e) {}
    const req = store.put({ id: 1, ...settings });
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        resolve('addSettings: ' + evt.type);
      };

      req.onerror = function(evt) {
        reject('addSettings: ' + evt.target['error'].message);
      };
    });
  }

  addPushSub(pushSubscription: PushSubscription): Promise<any> {
    const store = this.getObjectStore(this.PUSHSUB_STORE, 'readwrite');
    const req = store.put({ id: 1, pushSubscription });
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        resolve('addPushSub: ' + evt.type);
      };
      req.onerror = function(evt) {
        reject('addPushSub: ' + evt.target['error'].message);
      };
    });
  }

  addDeviceIcon(idx: string, icon: string) {
    const store = this.getObjectStore(this.ICON_STORE, 'readwrite');
    const req = !!icon
      ? store.put({ idx: idx, deviceIcon: icon })
      : store.delete(idx);
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        resolve('addDeviceIcon: ' + evt.type);
      };
      req.onerror = function(evt) {
        reject('addDeviceIcon: ' + evt.target['error'].message);
      };
    });
  }

  syncSettings(settings?: DomoticzSettings) {
    if (!!settings) {
      this.subject.next({
        ...this.subject.value,
        settings: null
      });
    } else {
      const req = this.getObjectStore(this.SETTINGS_STORE, 'readonly').get(1);
      req.onsuccess = ((evt: any) => {
        this.subject.next({
          ...this.subject.value,
          settings: this.decodeSettings(evt.target.result)
        });
      }).bind(this);
    }
  }

  clearSettings() {
    const store = this.getObjectStore(this.SETTINGS_STORE, 'readwrite');
    const req = store.clear();
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        resolve('clearSettings: ' + evt.type);
      };
      req.onerror = function(evt) {
        reject('clearSettings: ' + evt.target['error'].message);
      };
    });
  }

  syncPushSub(pushSubscription: PushSubscription) {
    const req = this.getObjectStore(this.PUSHSUB_STORE, 'readonly').get(1);
    req.onsuccess = ((evt: any) => {
      if (!!evt.target.result) {
        this.subject.next({
          ...this.subject.value,
          pushSubscription: evt.target.result.pushSubscription
        });
      } else {
        this.subject.next({
          ...this.subject.value,
          pushSubscription
        });
      }
    }).bind(this);
  }

  syncDeviceIcon(idx: string, icon: string) {
    const req = this.getObjectStore(this.ICON_STORE, 'readonly').get(idx);
    req.onsuccess = ((evt: any) => {
      if (!!evt.target.result) {
        this.subject.next({
          ...this.subject.value,
          deviceIcon: evt.target.result.deviceIcon
        });
      } else {
        this.subject.next({
          ...this.subject.value,
          deviceIcon: icon
        });
      }
    }).bind(this);
  }

  decodeSettings(settings: DomoticzSettings): DomoticzSettings {
    if (!!settings && !!settings.authToken) {
      return {
        ...settings,
        credentials: {
          username: atob(settings.authToken).split(':')[0],
          password: atob(settings.authToken).split(':')[1]
        }
      };
    } else {
      return settings;
    }
  }

  getAllIcons() {
    return this.getAllStore(this.ICON_STORE);
  }

  getAllStore(store: string) {
    const req = this.getObjectStore(store, 'readonly').getAll();
    return new Promise((resolve, reject) => {
      req.onsuccess = (evt: any) => resolve(evt.target.result || []);
      req.onerror = (evt: any) => reject(evt.target['error'].message);
    });
  }
}
