import { Routes } from '@angular/router';

import { DeviceOptionsComponent } from './device-options.component';

import { DeviceOptionsResolver } from '@nd/core/resolvers/device-options.resolver';

export const routes: Routes = [
  {
    path: '',
    component: DeviceOptionsComponent,
    resolve: {
      data: DeviceOptionsResolver
    }
  }
];
