import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  NbTabsetModule,
  NbCardModule,
  NbInputModule,
  NbCheckboxModule,
  NbSpinnerModule,
  NbMenuModule,
  NbIconModule,
  NbButtonModule,
  NbSelectModule
} from '@nebular/theme';

import { NbEvaIconsModule } from '@nebular/eva-icons';

import { sharedComponents } from './components';

import { SafePipe } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    NbTabsetModule,
    NbCardModule,
    ReactiveFormsModule,
    NbInputModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbMenuModule.forRoot(),
    NbEvaIconsModule,
    NbIconModule,
    NbButtonModule,
    NbSelectModule
  ],
  exports: [
    sharedComponents,
    CommonModule,
    SafePipe,
    NbCardModule,
    NbSpinnerModule,
    NbIconModule,
    NbButtonModule,
    NbTabsetModule,
    NbSelectModule
  ],
  declarations: [sharedComponents, SafePipe]
})
export class SharedModule {}
