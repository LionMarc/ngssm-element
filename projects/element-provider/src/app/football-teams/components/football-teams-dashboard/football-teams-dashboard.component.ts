import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsoleAppender, NgSsmComponent, Store } from 'ngssm-store';
import { MatCardModule } from '@angular/material/card';
import { NgssmCachesDisplayButtonComponent } from 'ngssm-remote-data';

@Component({
  selector: 'app-football-teams-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgssmCachesDisplayButtonComponent],
  templateUrl: './football-teams-dashboard.component.html',
  styleUrls: ['./football-teams-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FootballTeamsDashboardComponent extends NgSsmComponent {
  constructor(store: Store, consoleAppender: ConsoleAppender) {
    super(store);

    consoleAppender.start('football-teams');

    this.unsubscribeAll$.subscribe(() => consoleAppender.stop());
  }
}
