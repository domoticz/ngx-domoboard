import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

import { DomoticzSettings } from '@nd/core/models';

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

  addUrl(url: DomoticzSettings): Promise<any> {
    const store = this.getObjectStore(this.DB_STORE_NAME, 'readwrite');
    const req = store.add({ id: 1, ...url});
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function (evt: any) {
        resolve('addUrl: ' + evt.type);
      };

      req.onerror = function (evt) {
        reject('addUrl: ' + evt.target['error'].message);
      };
    });
  }

  setUrl(settings?: DomoticzSettings) {
    if (!!settings) {
      this.subject.next(null);
    } else {
      const req = this.getObjectStore(this.DB_STORE_NAME, 'readonly').get(1);
      req.onsuccess = ((evt: any) => {
        this.subject.next(evt.target.result);
      }).bind(this);
    }
  }

  getUrl(): Promise<any> {
    const req = this.getObjectStore(this.DB_STORE_NAME, 'readonly').get(1);
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = ((evt: any) => {
        resolve(evt.target.result);
      });

      req.onerror = function (evt) {
        reject('getUrl: ' + evt.target['error'].message);
      };
    });
  }

}
