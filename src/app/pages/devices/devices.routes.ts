import { Routes } from '@angular/router';

import { DevicesComponent } from './devices.component';

import { DevicesResolver } from '@nd/core/resolvers/devices.resolver';

export const routes: Routes = [
  {
    path: 'switches',
    component: DevicesComponent,
    resolve: {
      data: DevicesResolver
    }
  },
  {
    path: 'temperature',
    component: DevicesComponent,
    resolve: {
      data: DevicesResolver
    }
  }
];
