import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'app-simple',
  imports: [CommonModule],
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleComponent extends NgSsmComponent {
  constructor(store: Store) {
    super(store);

    this.unsubscribeAll$.subscribe(() => console.log('SimpleComponent DESTROYED'));
  }

  @Input() public count = 0;
}
