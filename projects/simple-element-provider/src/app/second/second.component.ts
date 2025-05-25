import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngssm-second',
  imports: [CommonModule],
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondComponent implements OnDestroy {
  public ngOnDestroy(): void {
    console.log('SecondComponent DESTROYED');
  }
}
