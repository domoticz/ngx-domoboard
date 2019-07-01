import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PushNotificationsService {

  pushServer = 'https://zg9tbw.duckdns.org:5035/api/monitor-device';

  constructor(private httpClient: HttpClient) { }

  subscribeToNotifications(payload: any): Observable<any> {
    return this.httpClient.post(this.pushServer, payload);
  }

}
