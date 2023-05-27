import { Component, Input, OnDestroy, ViewContainerRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { RemoteCall, RemoteCallStatus } from 'ngssm-remote-data';

import { NgssmElementsLoaderService } from '../ngssm-elements-loader.service';

@Component({
  selector: 'ngssm-element',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './ngssm-element.component.html',
  styleUrls: ['./ngssm-element.component.scss']
})
export class NgssmElementComponent implements OnDestroy {
  private element: HTMLElement | undefined;

  public readonly loadingStatus = signal<RemoteCall>({ status: RemoteCallStatus.none });
  public readonly remoteCallStatus = RemoteCallStatus;

  constructor(private viewContainerRef: ViewContainerRef, private loaderService: NgssmElementsLoaderService) {}

  @Input() public set name(value: string) {
    if (this.element) {
      this.viewContainerRef.element.nativeElement.removeChild(this.element);
    }
    this.viewContainerRef.clear();

    const subscription = this.loaderService.load(value).subscribe((status) => {
      this.loadingStatus.set(status);
      if (status.status === RemoteCallStatus.done) {
        this.element = document.createElement(value);
        this.viewContainerRef.element.nativeElement.appendChild(this.element);
      }

      if (status.status === RemoteCallStatus.done || status.status === RemoteCallStatus.ko) {
        subscription.unsubscribe();
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.element) {
      this.viewContainerRef.element.nativeElement.removeChild(this.element);
      this.element = undefined;
    }
  }
}
