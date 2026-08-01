import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideFootballTeams } from './football-teams/provide-football-teams';
import { provideNgssmRemoteData } from 'ngssm-remote-data';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(MatSnackBarModule, MatDialogModule), provideNgssmRemoteData(), provideFootballTeams()]
};
