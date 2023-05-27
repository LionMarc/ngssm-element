import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NGSSM_REMOTE_DATA_PROVIDER } from 'ngssm-remote-data';
import { FootballTeamsLoaderService } from './services';

export const provideFootballTeams = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    { provide: NGSSM_REMOTE_DATA_PROVIDER, useClass: FootballTeamsLoaderService, multi: true }
  ]);
};
