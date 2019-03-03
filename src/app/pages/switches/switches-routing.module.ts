import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SwitchesComponent } from './switches.component';

const routes: Routes = [
  { path: '',  component: SwitchesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: [],
})
export class SwitchesRoutingModule { }
