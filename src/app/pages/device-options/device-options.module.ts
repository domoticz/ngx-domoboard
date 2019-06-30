import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NbButtonModule, NbInputModule } from '@nebular/theme';

import { SharedModule } from '@nd/shared/shared.module';

import { DeviceOptionsComponent } from './device-options.component';
import { routes } from './device-options.routes';
import { NameComponent } from './name/name.component';
import { PushNotificationsComponent } from './push-notifications/push-notifications.component';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    NbButtonModule,
    NbInputModule
  ],
  exports: [],
  declarations: [
    DeviceOptionsComponent,
    NameComponent,
    PushNotificationsComponent
  ],
  providers: [],
})
export class DeviceOptionsModule { }
