import { Injectable } from '@angular/core';

import { DBService } from './db.service';

@Injectable({ providedIn: 'root' })
export class ThemeSelectService extends DBService {
  get dbSubject() {
    return this.dbService.subject;
  }

  constructor(private dbService: DBService) {
    super();
  }

  getThemeStore(mode: string) {
    return this.dbService.getObjectStore(this.THEME_STORE, mode);
  }

  saveTheme(theme: string) {
    const store = this.getThemeStore('readwrite');
    const req = store.put({ id: 1, selectedTheme: theme });
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = function(evt: any) {
        this.dbSubject.next({
          ...this.dbSubject.value,
          selectedTheme: theme
        });
        resolve('saveTheme: ' + evt.type);
      }.bind(this);

      req.onerror = function(evt) {
        reject('saveTheme: ' + evt.target['error'].message);
      };
    });
  }

  syncTheme() {
    const req = this.getThemeStore('readonly').get(1);
    req.onsuccess = ((evt: any) => {
      const res = evt.target.result;
      this.dbSubject.next({
        ...this.dbSubject.value,
        selectedTheme: res ? res.selectedTheme : 'default'
      });
    }).bind(this);
  }
}
