import { Injectable } from '@angular/core';

import { InMemoryDbService } from 'angular-in-memory-web-api';

import { lights } from '@nd/core/models/in-memory-lights';

@Injectable({providedIn: 'root'})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    return lights;
  }

}
