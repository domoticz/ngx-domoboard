import { Injectable } from '@angular/core';

import { DBService } from './db.service';

@Injectable({ providedIn: 'root' })
export class DeviceIconService extends DBService {
  constructor() {
    super();
  }

  addDeviceIcon(idx: string, icon: string) {
    const store = this.getObjectStore(this.ICON_STORE, 'readwrite');
    const req = store.put({ idx: idx, deviceIcon: icon });
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        resolve('addDeviceIcon: ' + evt.type);
      };
      req.onerror = function(evt) {
        reject('addDeviceIcon: ' + evt.target['error'].message);
      };
    });
  }

  deleteDeviceIcon(idx: string) {
    const store = this.getObjectStore(this.ICON_STORE, 'readwrite');
    const req = store.delete(idx);
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        resolve('deleteDeviceIcon: ' + evt.type);
      };
      req.onerror = function(evt) {
        reject('deleteDeviceIcon: ' + evt.target['error'].message);
      };
    });
  }

  getAllIcons() {
    return this.getAllStore(this.ICON_STORE);
  }
}
