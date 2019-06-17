import { HeaderComponent } from './header/header.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { settingsSidebarComponents } from './settings-sidebar';
import { menuSidebarComponents } from '../menu-sidebar';

export const sharedComponents: any[] = [
  HeaderComponent,
  ...settingsSidebarComponents,
  StatusCardComponent,
  SvgIconComponent,
  ...menuSidebarComponents
];
