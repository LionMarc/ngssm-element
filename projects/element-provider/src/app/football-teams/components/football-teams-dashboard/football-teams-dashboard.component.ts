import { Component, ChangeDetectionStrategy, inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ConsoleAppender, Logger, Store } from 'ngssm-store';
import { NgssmCachesDisplayButtonComponent } from 'ngssm-remote-data';
import { NgssmEventBus } from 'ngssm-element';

@Component({
  selector: 'ngssm-football-teams-dashboard',
  imports: [MatCardModule, MatButtonModule, NgssmCachesDisplayButtonComponent],
  templateUrl: './football-teams-dashboard.component.html',
  styleUrls: ['./football-teams-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FootballTeamsDashboardComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly consoleAppender = inject(ConsoleAppender);
  private readonly eventBus = inject(NgssmEventBus);
  private readonly logger = inject(Logger);

  constructor() {
    this.consoleAppender.start('football-teams');

    this.eventBus.event$.pipe(takeUntilDestroyed()).subscribe((e) => {
      if (e.type === 'football-team') {
        this.logger.information(`Event received`, e);
      }
    });
  }

  public ngOnDestroy(): void {
    this.consoleAppender.stop();
  }

  public publishEvent(): void {
    this.eventBus.publish({
      type: 'football-team-test',
      date: new Date()
    });
  }
}
