import { Injectable } from '@angular/core';

import { DBService } from './db.service';
import { DeviceIconService } from './device-icon.service';
import { MonitoredDeviceService } from './monitored-device.service';
import { PushSubscriptionService } from './push-subscription.service';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  constructor(
    private dbService: DBService,
    private iconService: DeviceIconService,
    private monitorService: MonitoredDeviceService,
    private pushSubService: PushSubscriptionService
  ) {}

  async init() {
    return this.dbService.openDb().then(() => {
      this.iconService.syncDeviceIcons();
      this.monitorService.syncMonitoredDevices();
      this.dbService.syncSettings();
      this.pushSubService.syncPushSub();
    });
  }
}
