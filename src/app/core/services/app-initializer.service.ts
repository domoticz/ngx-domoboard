import { Injectable } from '@angular/core';

import { DBService } from './db.service';
import { DeviceIconService } from './device-icon.service';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  constructor(
    private dbService: DBService,
    private iconService: DeviceIconService
  ) {}

  async init() {
    return this.dbService.openDb().then(() => {
      this.dbService.syncSettings();
      this.dbService.syncPushSub(null);
      this.iconService.syncDeviceIcons();
    });
  }
}
