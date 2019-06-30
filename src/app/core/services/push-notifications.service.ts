import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PushNotificationsService {

  pushServer = 'localhost:5035';

  constructor(private httpClient: HttpClient) { }


}
