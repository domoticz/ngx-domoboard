import { Injectable } from '@angular/core';

import { lights } from '@nd/core/models/in-memory-lights';

@Injectable({providedIn: 'root'})
export class InMemoryDataService {

  createDb() {
    return lights;
  }

}
