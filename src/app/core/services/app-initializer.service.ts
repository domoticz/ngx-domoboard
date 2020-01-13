import { Injectable } from '@angular/core';

import { DBService } from './db.service';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  constructor(private dbService: DBService) {}

  async init() {
    return this.dbService.openDb().then(() => {
      this.dbService.syncSettings();
      this.dbService.syncPushSub(null);
    });
  }
}
