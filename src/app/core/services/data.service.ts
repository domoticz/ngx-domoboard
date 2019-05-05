import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '@nd/../environments/environment';

export abstract class DataService {

  protected baseUrl: string = environment.domoticzUrl;

  db: IDBDatabase;

  DB_NAME = 'NDDB';

  DB_VERSION = 1;

  DB_STORE_NAME = 'domoticz_connection_credentials';

  constructor(protected httpClient: HttpClient) {}

  protected get<T>(relativeUrl: string): Observable<T> {
    return this.httpClient.get<T>(`${ this.baseUrl }${ relativeUrl }`);
  }

  protected post<T>(relativeUrl: string, data: any): Observable<T> {
    return this.httpClient.post<T>(`${ this.baseUrl }${ relativeUrl }`, data);
  }

  openDb() {
    const self = this;
    console.log('openDb ...');
    const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    req.onsuccess = function (evt) {
      // Better use "this" than "req" to get the result to avoid problems with
      // garbage collection.
      // db = req.result;
      self.db = this.result;
      console.log('openDb DONE');
    }.bind(self);
    req.onerror = function (evt) {
      console.error('openDb:', evt.target['errorCode']);
    };

    req.onupgradeneeded = function (evt) {
      console.log('openDb.onupgradeneeded');
      const store = evt.currentTarget['result'].createObjectStore(
        self.DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });

      store.createIndex('ip', 'ip', { unique: true });
      store.createIndex('port', 'port', { unique: true });
    }.bind(self);
  }

}
