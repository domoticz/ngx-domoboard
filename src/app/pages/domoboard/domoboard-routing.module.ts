import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DomoboardComponent } from './domoboard.component';

const routes: Routes = [
  { path: '',  component: DomoboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: [],
})
export class DomoboardRoutingModule { }
