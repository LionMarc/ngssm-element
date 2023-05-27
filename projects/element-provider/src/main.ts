import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

import { appConfig } from './app/app.config';
import { FootballTeamsDashboardComponent } from './app/football-teams/public-api';

createApplication(appConfig).then((appRef) => {
  const footballTeamsDashboard = createCustomElement(FootballTeamsDashboardComponent, { injector: appRef.injector });
  customElements.define('ngssm-football-teams-dashboard', footballTeamsDashboard);
});
