import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'devices',
    loadChildren: () =>
      import('./pages/devices/devices.module').then(m => m.DevicesModule)
  },
  {
    path: 'options/:idx',
    loadChildren: () =>
      import('./pages/device-options/device-options.module').then(
        m => m.DeviceOptionsModule
      )
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
