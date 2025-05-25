import { Component, ChangeDetectionStrategy, Input, input, effect } from '@angular/core';
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
  public readonly name = input<string | undefined>(undefined);

  constructor(store: Store) {
    super(store);

    this.unsubscribeAll$.subscribe(() => console.log('SimpleComponent DESTROYED'));

    effect(() => {
      const currentName = this.name();
      console.log('[SimpleComponent]', currentName);
    });
  }

  @Input() public count = 0;
}
