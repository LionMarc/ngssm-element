import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NgssmElementComponent, NgssmElementsLoaderService } from 'ngssm-element';
import { NgssmCachesDisplayButtonComponent } from 'ngssm-remote-data';
import { ConsoleAppender } from 'ngssm-store';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatToolbarModule,
    MatCardModule,
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
  }
}
