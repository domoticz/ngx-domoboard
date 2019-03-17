import { NgModule } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

import { NbTabsetModule, NbCardModule } from '@nebular/theme';

import { HeaderComponent, StatusCardComponent, SvgIconComponent } from './components';

import { SafePipe } from './pipes';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NbTabsetModule,
    NbCardModule
  ],
  exports: [
    HeaderComponent,
    StatusCardComponent,
    NativeScriptCommonModule,
    SafePipe,
    SvgIconComponent
  ],
  declarations: [
    HeaderComponent,
    StatusCardComponent,
    SafePipe,
    SvgIconComponent
  ]
})
export class SharedModule { }
