import { Component, inject, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NgssmElementComponent, NgssmElementsLoaderService, NgssmEventBus } from 'ngssm-element';
import { NgssmCachesDisplayButtonComponent } from 'ngssm-remote-data';
import { ConsoleAppender, Logger } from 'ngssm-store';

@Component({
  selector: 'ngssm-root',
  imports: [
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
  private readonly elementsLoaderService = inject(NgssmElementsLoaderService);
  private readonly consoleAppender = inject(ConsoleAppender);
  private readonly eventBus = inject(NgssmEventBus);
  private readonly logger = inject(Logger);

  public readonly elementNames: string[] = [
    'ngssm-football-teams-dashboard',
    'ngssm-element-simple',
    'ngssm-element-second'
  ];

  public readonly selectedElementName = signal<string | undefined>(undefined);
  public readonly counterControl = new FormControl(0);
  public readonly nameControl = new FormControl<string | undefined>(undefined);
  public readonly formGroup = new FormGroup({
    count: this.counterControl,
    name: this.nameControl
  });
  public readonly data = signal<{ count: number; name?: string }>({ count: 0 });

  constructor() {
    this.consoleAppender.start();
    this.elementsLoaderService.addElementConfig({
      url: './assets/element-provider/element-provider.js',
      names: ['ngssm-football-teams-dashboard']
    });
    this.elementsLoaderService.addElementConfig({
      url: './assets/simple-element-provider/simple-element-provider.js',
      names: ['ngssm-element-simple', 'ngssm-element-second']
    });

    this.formGroup.valueChanges.subscribe((value) =>
      this.data.set({ count: value?.count ?? -1, name: value?.name ?? undefined })
    );

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
