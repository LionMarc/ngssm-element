/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, ViewContainerRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { filter, take } from 'rxjs';

import { RemoteCall, RemoteCallStatus } from 'ngssm-remote-data';

import { NgssmElementsLoaderService } from '../ngssm-elements-loader.service';
import { WithAccessToken } from '../with-access-token';
import { Logger } from 'ngssm-store';

@Component({
    selector: 'ngssm-element',
    imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
    templateUrl: './ngssm-element.component.html',
    styleUrls: ['./ngssm-element.component.scss']
})
export class NgssmElementComponent implements OnDestroy {
  private element: HTMLElement | undefined;
  private _data: object | undefined;
  private _accessToken: string | null | undefined;
  private _attributes: { name: string; value: any }[] = [];
  private _debug = false;

  public readonly loadingStatus = signal<RemoteCall>({ status: RemoteCallStatus.inProgress });
  public readonly remoteCallStatus = RemoteCallStatus;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private loaderService: NgssmElementsLoaderService,
    private logger: Logger
  ) {}

  @Input() public set attributes(value: { name: string; value: any }[]) {
    this._attributes = value;
    this.setAttributesToElement();
  }

  @Input() public set data(value: object) {
    if (this._debug) {
      this.logger.debug(`[NgssmElementComponent] data=`, value);
    }

    this._data = value;
    this.setDataToElement();
  }

  @Input() public set accessToken(value: string | null | undefined) {
    this._accessToken = value;
    this.setAccessTokenToElement();
  }

  @Input() public set name(value: string | null | undefined) {
    if (this._debug) {
      this.logger.debug(`[NgssmElementComponent] name=`, value);
    }

    if (this.element) {
      this.viewContainerRef.element.nativeElement.removeChild(this.element);
    }

    this.viewContainerRef.clear();

    if (!value) {
      return;
    }

    this.loaderService
      .load(value)
      .pipe(
        filter((v) => v.status !== RemoteCallStatus.none && v.status !== RemoteCallStatus.inProgress),
        take(1)
      )
      .subscribe((status) => {
        this.loadingStatus.set(status);
        if (status.status === RemoteCallStatus.done) {
          this.element = document.createElement(value);
          this.setAttributesToElement();
          this.setDataToElement();
          this.setAccessTokenToElement();
          this.viewContainerRef.element.nativeElement.appendChild(this.element);
        }
      });
  }

  @Input() public set debug(value: boolean | undefined | null) {
    this._debug = value === true;
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

    if (this._debug) {
      this.logger.debug(`[NgssmElementComponent] setDataToElement`, this._data);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.keys(this._data).forEach((key) => ((this.element as any)[key] = (this._data as any)[key]));
  }

  private setAttributesToElement(): void {
    if (!this.element || this._attributes.length === 0) {
      return;
    }

    this._attributes.forEach((attribute) => this.element?.setAttribute(attribute.name, attribute.value));
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
