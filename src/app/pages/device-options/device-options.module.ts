import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NbInputModule, NbProgressBarModule } from '@nebular/theme';

import { SharedModule } from '@nd/shared/shared.module';

import { DeviceOptionsComponent } from './device-options.component';
import { routes } from './device-options.routes';
import { NameComponent } from './name/name.component';
import { PushNotificationsComponent } from './push-notifications/push-notifications.component';
import { DimLevelComponent } from './dim-level/dim-level.component';
import { DeviceIconComponent } from './device-icon/device-icon.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    NbInputModule,
    NbProgressBarModule
  ],
  declarations: [
    DeviceOptionsComponent,
    NameComponent,
    PushNotificationsComponent,
    DimLevelComponent,
    DeviceIconComponent,
    ColorPickerComponent
  ],
  providers: [],
})
export class DeviceOptionsModule { }
