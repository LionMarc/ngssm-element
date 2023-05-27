import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

import { Logger } from 'ngssm-store';
import { RemoteCall, RemoteCallStatus } from 'ngssm-remote-data';

import { NgssmElementConfig } from './ngssm-element-config';

interface ExtendedNgssmElementConfig {
  config: NgssmElementConfig;
  loadingStatus: BehaviorSubject<RemoteCall>;
}

@Injectable({
  providedIn: 'root'
})
export class NgssmElementsLoaderService {
  private readonly elementConfigs: ExtendedNgssmElementConfig[] = [];

  constructor(private logger: Logger, @Inject(DOCUMENT) private document: Document) {}

  public addElementConfig(elementConfig: NgssmElementConfig): boolean {
    if (this.elementConfigs.findIndex((e) => e.config.url === elementConfig.url) !== -1) {
      this.logger.error(`[NgssmElementsLoaderService] There is already a config for '${elementConfig.url}'`);
      return false;
    }

    this.elementConfigs.push({
      config: elementConfig,
      loadingStatus: new BehaviorSubject<RemoteCall>({ status: RemoteCallStatus.none })
    });
    this.logger.information(`[NgssmElementsLoaderService] Config for url '${elementConfig.url}' added`);

    return true;
  }

  public load(name: string): Observable<RemoteCall> {
    const config = this.elementConfigs.find((c) => c.config.names.includes(name));
    if (!config) {
      throw new Error(`No config set for '${name}'`);
    }

    if (config.loadingStatus.getValue().status !== RemoteCallStatus.none) {
      return config.loadingStatus.asObservable();
    }

    const script = this.document.createElement('script');
    script.type = 'module';
    script.src = config.config.url;
    script.onload = () => {
      this.logger.information(`[NgssmElementsLoaderService] script for '${name}' loaded.`);
      config.loadingStatus.next({ status: RemoteCallStatus.done });
    };

    script.onerror = (event) => {
      this.logger.error(`[NgssmElementsLoaderService] Unable to load script for '${name}'.`, event);
      const message = `Unable to load script ${script.src}.`;
      config.loadingStatus.next({ status: RemoteCallStatus.ko, message });
    };

    config.loadingStatus.next({ status: RemoteCallStatus.inProgress });
    this.logger.information(`[NgssmElementsLoaderService] loading script for '${name}'.`);
    this.document.body.appendChild(script);
    return config.loadingStatus.asObservable();
  }
}
