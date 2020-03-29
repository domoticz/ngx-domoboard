import { HeaderComponent } from './header/header.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { settingsSidebarComponents } from './settings-sidebar';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { ThemeSelectComponent } from './theme-select/theme-select.component';
import { TimeBarComponent } from './time-bar/time-bar.component';

export const sharedComponents: any[] = [
  HeaderComponent,
  ...settingsSidebarComponents,
  StatusCardComponent,
  SvgIconComponent,
  MenuSidebarComponent,
  ThemeSelectComponent,
  TimeBarComponent
];
