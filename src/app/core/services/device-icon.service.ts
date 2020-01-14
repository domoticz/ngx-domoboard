import { Injectable } from '@angular/core';

import { DBService } from './db.service';

@Injectable({ providedIn: 'root' })
export class DeviceIconService extends DBService {
  constructor(private debService: DBService) {
    super();
  }

  getIconStore(mode: string) {
    return this.debService.getObjectStore(this.ICON_STORE, mode);
  }

  addDeviceIcon(idx: string, icon: string) {
    const store = this.getIconStore('readwrite');
    const req = store.put({ idx: idx, deviceIcon: icon });
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        this.subject.next({
          ...this.subject.value,
          deviceIcons: [
            ...this.subject.value.deviceIcons,
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
      this.subject.next({
        ...this.subject.value,
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

  getAllIcons() {
    const req = this.getIconStore('readonly').getAll();
    return new Promise((resolve, reject) => {
      req.onsuccess = (evt: any) => resolve(evt.target.result || []);
      req.onerror = (evt: any) => reject(evt.target['error'].message);
    });
  }
}
