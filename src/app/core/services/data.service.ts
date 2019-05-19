import { HttpClient } from '@angular/common/http';

import { Observable, of, throwError, empty, BehaviorSubject, Subject, iif } from 'rxjs';

import { environment } from '@nd/../environments/environment';
import { Injectable } from '@angular/core';
import { BaseUrl } from '../models';
import { catchError, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export abstract class DataService {

  baseUrl$ = new Subject<BaseUrl>();

  db: IDBDatabase;

  DB_NAME = 'NDDB';

  DB_VERSION = 1;

  DB_STORE_NAME = 'domoticz_url';

  constructor(protected httpClient: HttpClient) {}

  get<T>(relativeUrl: string): Observable<T> {
    return this.baseUrl$.pipe(
      distinctUntilChanged(),
      tap(v => console.log('value: ' + v)),
      switchMap(baseUrl => iif(() => !!baseUrl, this.httpClient.get<T>(
        `${baseUrl.ssl ? 'https' : 'http'}://${baseUrl.ip}:${baseUrl.port}/${ relativeUrl }`
      ), of()))
    );
  }

  protected post<T>(relativeUrl: string, data: any): Observable<T> {
    return this.baseUrl$.asObservable().pipe(
      distinctUntilChanged(),
      switchMap(baseUrl => iif(() => !!baseUrl, this.httpClient.post<T>(
      `${baseUrl.ssl ? 'https' : 'http'}://${baseUrl.ip}:${baseUrl.port}/${ relativeUrl }`,
      data
      ), of()))
    );
  }

  openDb() {
    const self = this;
    const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    req.onsuccess = function (evt) {
      this.db = evt.target.result;
    }.bind(this);
    req.onerror = function (evt) {
      console.error('openDb:', evt.target['errorCode']);
    };

    req.onupgradeneeded = function (evt) {
      const store = evt.currentTarget['result'].createObjectStore(
        self.DB_STORE_NAME, { keyPath: 'id', autoIncrement: true }
      );
      store.createIndex('ssl', 'ssl');
      store.createIndex('ip', 'ip');
      store.createIndex('port', 'port');
    }.bind(self);
  }

  getObjectStore(store_name, mode) {
    const tx = this.db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  addUrl(url: BaseUrl) {
    const store = this.getObjectStore(this.DB_STORE_NAME, 'readwrite');
    store.add(url);
  }

  getUrl() {
    const self = this;
    const store = this.getObjectStore(this.DB_STORE_NAME, 'readonly');
    const req = store.get(1);
    req.onsuccess = ((evt: any) => {
      self.baseUrl$.next(evt.target.result);
      console.log(evt.target.result);
    }).bind(self);
  }

}
