import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NgssmElementComponent, NgssmElementsLoaderService } from 'ngssm-element';
import { NgssmCachesDisplayButtonComponent } from 'ngssm-remote-data';
import { ConsoleAppender } from 'ngssm-store';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

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

  constructor(elementsLoaderService: NgssmElementsLoaderService, consoleAppender: ConsoleAppender) {
    consoleAppender.start();
    elementsLoaderService.addElementConfig({
      url: './assets/provided-elements.js',
      names: ['ngssm-football-teams-dashboard']
    });
    elementsLoaderService.addElementConfig({
      url: './assets/simple-elements.js',
      names: ['ngssm-element-simple', 'ngssm-element-second']
    });

    this.counterControl.valueChanges.subscribe((value) => this.data.set({ count: value ?? -1 }));
  }
}
