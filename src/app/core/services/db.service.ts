import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

import { DomoticzSettings } from '@nd/core/models';
import { Credentials } from '../models/credentials.interface';

@Injectable({ providedIn: 'root' })
export class DBService {

  private subject = new BehaviorSubject<DomoticzSettings>(null);
  store = this.subject.asObservable().pipe(
    distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
  );

  db: IDBDatabase;

  DB_NAME = 'NDDB';

  DB_VERSION = 1;

  DB_STORE_NAME = 'domoticz_settings';

  select<T>(...name: string[]): Observable<T> {
    return this.store.pipe(pluck(...name));
  }

  openDb(): Promise<any> {
    const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function (evt) {
        resolve(this.db = evt.target.result);
      }.bind(this);

      req.onerror = function (evt) {
        reject('openDb: ' + evt.target['error'].message);
      };

      req.onupgradeneeded = function (evt) {
        evt.currentTarget['result'].createObjectStore(
          this.DB_STORE_NAME, { keyPath: 'id' }
        );
      }.bind(this);
    });
  }

  getObjectStore(store_name, mode) {
    const tx = this.db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  addSettings(settings: DomoticzSettings): Promise<any> {
    const store = this.getObjectStore(this.DB_STORE_NAME, 'readwrite');
    try {
      if (!!Object.keys(settings.credentials).every(key => settings.credentials[key] !== null)) {
        const authToken = btoa(`${settings.credentials.username}:${settings.credentials.password}`);
        settings.authToken = authToken;
        delete settings.credentials;
      }
    } catch (e) { }
    const req = store.put({ id: 1, ...settings});
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function (evt: any) {
        resolve('addSettings: ' + evt.type);
      };

      req.onerror = function (evt) {
        reject('addSettings: ' + evt.target['error'].message);
      };
    });
  }

  setSettings(settings?: DomoticzSettings) {
    if (!!settings) {
      this.subject.next(null);
    } else {
      const req = this.getObjectStore(this.DB_STORE_NAME, 'readonly').get(1);
      req.onsuccess = ((evt: any) => {
        this.subject.next(this.decodeSettings(evt.target.result));
      }).bind(this);
    }
  }

  decodeSettings(settings: DomoticzSettings): DomoticzSettings {
    if (!!settings && !!settings.authToken) {
      return { ...settings, credentials: {
        username: atob(settings.authToken).split(':')[0],
        password: atob(settings.authToken).split(':')[1]
      } };
    } else {
      return settings;
    }
  }

}
