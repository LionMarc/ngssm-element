import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NgssmElementComponent, NgssmElementsLoaderService, NgssmEventBus } from 'ngssm-element';
import { NgssmCachesDisplayButtonComponent } from 'ngssm-remote-data';
import { ConsoleAppender, Logger } from 'ngssm-store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    NgssmElementComponent,
    NgssmCachesDisplayButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public readonly elementNames: string[] = [
    'ngssm-football-teams-dashboard',
    'ngssm-element-simple',
    'ngssm-element-second'
  ];

  public readonly selectedElementName = signal<string | undefined>(undefined);
  public readonly counterControl = new FormControl(0);
  public readonly data = signal<{ count: number }>({ count: 0 });

  constructor(
    elementsLoaderService: NgssmElementsLoaderService,
    consoleAppender: ConsoleAppender,
    private eventBus: NgssmEventBus,
    private logger: Logger
  ) {
    consoleAppender.start();
    elementsLoaderService.addElementConfig({
      url: './assets/element-provider/element-provider.js',
      names: ['ngssm-football-teams-dashboard']
    });
    elementsLoaderService.addElementConfig({
      url: './assets/simple-element-provider/simple-element-provider.js',
      names: ['ngssm-element-simple', 'ngssm-element-second']
    });

    this.counterControl.valueChanges.subscribe((value) => this.data.set({ count: value ?? -1 }));

    this.eventBus.event$.subscribe((e) => this.logger.information(`Event of type '${e.type}' received`, e));
  }

  public publisEventToFootballTeam(): void {
    this.eventBus.publish({
      type: 'football-team',
      data: {
        time: new Date(),
        test: true
      }
    });
  }
}
