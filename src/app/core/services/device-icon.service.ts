import { Injectable } from '@angular/core';

import { DBService } from './db.service';

@Injectable({ providedIn: 'root' })
export class DeviceIconService extends DBService {
  getIconStore(mode: any) {
    const tx = this.db.transaction(this.ICON_STORE, mode);
    return tx.objectStore(this.ICON_STORE);
  }

  addDeviceIcon(idx: string, icon: string) {
    const store = this.getIconStore('readwrite');
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
    const store = this.getIconStore('readwrite');
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
    const req = this.getIconStore('readonly').getAll();
    return new Promise((resolve, reject) => {
      req.onsuccess = (evt: any) => resolve(evt.target.result || []);
      req.onerror = (evt: any) => reject(evt.target['error'].message);
    });
  }
}
