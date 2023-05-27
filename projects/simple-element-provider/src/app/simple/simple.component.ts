import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'app-simple',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleComponent extends NgSsmComponent {
  constructor(store: Store) {
    super(store);
  }
}
