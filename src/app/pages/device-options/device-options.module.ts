import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  NbInputModule,
  NbProgressBarModule,
  NbSelectModule,
  NbTreeGridModule
} from '@nebular/theme';

import { SharedModule } from '@nd/shared/shared.module';

import { DeviceOptionsComponent } from './device-options.component';
import { routes } from './device-options.routes';
import { NameComponent } from './name/name.component';
import { PushNotificationsComponent } from './push-notifications/push-notifications.component';
import { DimLevelComponent } from './dim-level/dim-level.component';
import { DeviceIconComponent } from './device-icon/device-icon.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { historyComponents } from './history';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    NbInputModule,
    NbProgressBarModule,
    NbSelectModule,
    NbTreeGridModule
  ],
  declarations: [
    DeviceOptionsComponent,
    NameComponent,
    PushNotificationsComponent,
    DimLevelComponent,
    DeviceIconComponent,
    ColorPickerComponent,
    historyComponents
  ],
  providers: []
})
export class DeviceOptionsModule {}
