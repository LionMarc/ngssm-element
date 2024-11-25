import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { takeUntil } from 'rxjs';

import { ConsoleAppender, Logger, NgSsmComponent, Store } from 'ngssm-store';
import { NgssmCachesDisplayButtonComponent } from 'ngssm-remote-data';
import { NgssmEventBus } from 'ngssm-element';

@Component({
  selector: 'app-football-teams-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule, NgssmCachesDisplayButtonComponent],
  templateUrl: './football-teams-dashboard.component.html',
  styleUrls: ['./football-teams-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FootballTeamsDashboardComponent extends NgSsmComponent {
  constructor(
    store: Store,
    consoleAppender: ConsoleAppender,
    private eventBus: NgssmEventBus,
    private logger: Logger
  ) {
    super(store);

    consoleAppender.start('football-teams');

    this.unsubscribeAll$.subscribe(() => consoleAppender.stop());

    this.eventBus.event$.pipe(takeUntil(this.unsubscribeAll$)).subscribe((e) => {
      if (e.type === 'football-team') {
        this.logger.information(`Event received`, e);
      }
    });
  }

  public publishEvent(): void {
    this.eventBus.publish({
      type: 'football-team-test',
      date: new Date()
    });
  }
}
