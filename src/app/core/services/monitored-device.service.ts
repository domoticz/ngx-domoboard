import { Injectable } from '@angular/core';

import { DBService } from './db.service';

@Injectable({ providedIn: 'root' })
export class MonitoredDeviceService extends DBService {
  get dbSubject() {
    return this.dbService.subject;
  }

  constructor(private dbService: DBService) {
    super();
  }

  getMonitorStore(mode: string) {
    return this.dbService.getObjectStore(this.MONITOR_STORE, mode);
  }

  addMonitoredDevice(device: any) {
    const store = this.getMonitorStore('readwrite');
    const req = store.put({ idx: device.idx, monitoredDevice: device });
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        this.dbSubject.next({
          ...this.dbSubject.value,
          monitoredDevices: [
            ...this.dbSubject.value.monitoredDevices,
            { idx: device.idx, monitoredDevice: device }
          ]
        });
        resolve('addMonitoredDevice: ' + evt.type);
      }.bind(this);

      req.onerror = function(evt) {
        reject('addMonitoredDevice: ' + evt.target['error'].message);
      };
    });
  }

  syncMonitoredDevices() {
    const req = this.getMonitorStore('readonly').getAll();
    req.onsuccess = ((evt: any) => {
      const res = evt.target.result;
      this.dbSubject.next({
        ...this.dbSubject.value,
        monitoredDevices: res || []
      });
    }).bind(this);
  }

  deleteMonitoredDevice(device: any) {
    const req = this.getMonitorStore('readwrite').delete(device.idx);
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        const devices = [...this.dbSubject.value.monitoredDevices];
        const index = devices.indexOf(device);
        devices.splice(index, 1);
        this.dbSubject.next({
          ...this.dbSubject.value,
          monitoredDevices: devices
        });
        resolve('deleteMonitoredDevice: ' + evt.type);
      }.bind(this);
      req.onerror = function(evt) {
        reject('deleteMonitoredDevice: ' + evt.target['error'].message);
      };
    });
  }
}
