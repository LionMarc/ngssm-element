import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideFootballTeams } from './football-teams/provide-football-teams';
import { provideNgssmRemoteData } from 'ngssm-remote-data';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule, MatDialogModule),
    provideNgssmRemoteData(),
    provideFootballTeams()
  ]
};
