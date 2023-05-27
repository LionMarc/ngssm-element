import { Injectable } from '@angular/core';
import { RemoteDataProvider } from 'ngssm-remote-data';
import { FootballTeam, footballTeamsKey } from '../model';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FootballTeamsLoaderService implements RemoteDataProvider {
  public readonly remoteDataKey = footballTeamsKey;
  public readonly cacheDurationInSeconds = 60000;

  public get(): Observable<FootballTeam[]> {
    return of([
      {
        id: 1,
        name: 'PSG'
      }
    ]).pipe(delay(10000));
  }
}
