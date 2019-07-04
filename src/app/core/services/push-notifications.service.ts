import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

enum PushApi {
  server = 'https://zg9tbw.duckdns.org:5035/api',
  monitor = '/monitor-device',
  stop = '/stop-monitoring',
  isMonitoring = '/is-monitoring'
}

@Injectable({providedIn: 'root'})
export class PushNotificationsService {

  constructor(private httpClient: HttpClient) { }

  subscribeToNotifications(payload: any): Observable<any> {
    return this.httpClient.post(`${PushApi.server}${PushApi.monitor}`, payload);
  }

  isSubscribed(idx: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${PushApi.server}${PushApi.isMonitoring}`, { idx: idx })
      .pipe(
        map((resp: any) => resp.isMonitoring)
      );
  }

  stopSubscription(idx: string): Observable<any> {
    return this.httpClient.post<boolean>(`${PushApi.server}${PushApi.stop}`, { idx: idx });
  }

}
