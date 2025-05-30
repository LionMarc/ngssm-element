import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';


@Component({
  selector: 'ngssm-second',
  imports: [],
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondComponent implements OnDestroy {
  public ngOnDestroy(): void {
    console.log('SecondComponent DESTROYED');
  }
}
