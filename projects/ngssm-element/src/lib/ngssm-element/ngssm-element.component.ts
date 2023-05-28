import { Component, Input, OnDestroy, ViewContainerRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { RemoteCall, RemoteCallStatus } from 'ngssm-remote-data';

import { NgssmElementsLoaderService } from '../ngssm-elements-loader.service';
import { WithAccessToken } from '../with-access-token';

@Component({
  selector: 'ngssm-element',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './ngssm-element.component.html',
  styleUrls: ['./ngssm-element.component.scss']
})
export class NgssmElementComponent implements OnDestroy {
  private element: HTMLElement | undefined;
  private _data: object | undefined;
  private _accessToken: string | null | undefined;

  public readonly loadingStatus = signal<RemoteCall>({ status: RemoteCallStatus.none });
  public readonly remoteCallStatus = RemoteCallStatus;

  constructor(private viewContainerRef: ViewContainerRef, private loaderService: NgssmElementsLoaderService) {}

  @Input() public set name(value: string | null | undefined) {
    if (this.element) {
      this.viewContainerRef.element.nativeElement.removeChild(this.element);
    }
    this.viewContainerRef.clear();

    if (!value) {
      return;
    }

    const subscription = this.loaderService.load(value).subscribe((status) => {
      this.loadingStatus.set(status);
      if (status.status === RemoteCallStatus.done) {
        this.element = document.createElement(value);
        this.viewContainerRef.element.nativeElement.appendChild(this.element);
        this.setDataToElement();
        this.setAccessTokenToElement();
      }

      if (status.status === RemoteCallStatus.done || status.status === RemoteCallStatus.ko) {
        setTimeout(() => subscription.unsubscribe());
      }
    });
  }

  @Input() public set data(value: object) {
    this._data = value;
    this.setDataToElement();
  }

  @Input() public set accessToken(value: string | null | undefined) {
    this._accessToken = value;
    this.setAccessTokenToElement();
  }

  public ngOnDestroy(): void {
    if (this.element) {
      this.viewContainerRef.element.nativeElement.removeChild(this.element);
      this.element = undefined;
    }
  }

  private setDataToElement(): void {
    if (!this.element || !this._data) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.keys(this._data).forEach((key) => ((this.element as any)[key] = (this._data as any)[key]));
  }

  private setAccessTokenToElement(): void {
    if (!this.element) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const withAccessToken: WithAccessToken = this.element as any;
    withAccessToken.accessToken = this._accessToken;
  }
}
