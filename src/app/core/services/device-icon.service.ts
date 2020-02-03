import { Injectable } from '@angular/core';

import { DBService } from './db.service';

@Injectable({ providedIn: 'root' })
export class DeviceIconService extends DBService {
  get dbSubject() {
    return this.dbService.subject;
  }

  constructor(private dbService: DBService) {
    super();
  }

  getIconStore(mode: string) {
    return this.dbService.getObjectStore(this.ICON_STORE, mode);
  }

  addDeviceIcon(idx: string, icon: string) {
    const store = this.getIconStore('readwrite');
    const req = store.put({ idx: idx, deviceIcon: icon });
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        this.dbSubject.next({
          ...this.dbSubject.value,
          deviceIcons: [
            ...this.dbSubject.value.deviceIcons,
            { idx: idx, deviceIcon: icon }
          ]
        });
        resolve('addDeviceIcon: ' + evt.type);
      }.bind(this);

      req.onerror = function(evt) {
        reject('addDeviceIcon: ' + evt.target['error'].message);
      };
    });
  }

  syncDeviceIcons() {
    const req = this.getIconStore('readonly').getAll();
    req.onsuccess = ((evt: any) => {
      const res = evt.target.result;
      this.dbSubject.next({
        ...this.dbSubject.value,
        deviceIcons: res || []
      });
    }).bind(this);
  }

  deleteDeviceIcon(idx: string) {
    const req = this.getIconStore('readwrite').delete(idx);
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        resolve('deleteDeviceIcon: ' + evt.type);
      };
      req.onerror = function(evt) {
        reject('deleteDeviceIcon: ' + evt.target['error'].message);
      };
    });
  }
}
