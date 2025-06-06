import { Component, ChangeDetectionStrategy, Input, input, effect, OnDestroy } from '@angular/core';


@Component({
  selector: 'ngssm-simple',
  imports: [],
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleComponent implements OnDestroy {
  public readonly name = input<string | undefined>(undefined);

  constructor() {
    effect(() => {
      const currentName = this.name();
      console.log('[SimpleComponent]', currentName);
    });
  }

  @Input() public count = 0;

  public ngOnDestroy(): void {
    console.log('SimpleComponent DESTROYED');
  }
}
