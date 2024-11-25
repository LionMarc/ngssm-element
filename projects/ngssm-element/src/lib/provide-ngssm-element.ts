import {
  EnvironmentProviders,
  InjectionToken,
  Type,
  makeEnvironmentProviders,
  inject,
  provideAppInitializer
} from '@angular/core';
import { Observable, filter } from 'rxjs';

import { NgssmEvent, NgssmEventBus } from './ngssm-event-bus';
import { AccessTokenStore } from './access-token-store';
import { Logger } from 'ngssm-store';

export const requestAccessTokenEvent = 'request-access-token';
export const getRequestAccessTokenEvent = (): NgssmEvent => ({
  type: requestAccessTokenEvent
});

export const accessTokenEvent = 'access-token';
export interface AccessTokenEvent extends NgssmEvent {
  token: string;
}
export const getAccessTokenEvent = (token: string): AccessTokenEvent => ({
  type: accessTokenEvent,
  token
});

export const requestAndStoreAccessToken = (
  eventBus: NgssmEventBus,
  accessTokenStore: AccessTokenStore
): (() => void) => {
  return () => {
    eventBus.event$.pipe(filter((e) => e.type === accessTokenEvent)).subscribe((e) => {
      accessTokenStore.accessToken = (e as AccessTokenEvent).token;
    });
    eventBus.publish(getRequestAccessTokenEvent());
  };
};

export const provideNgssmElementForElementsProvider = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideAppInitializer(requestAndStoreAccessToken(inject(NgssmEventBus), inject(AccessTokenStore)))
  ]);
};

export interface AccessTokenProvider {
  getAccessToken(): string;
}

export const NGSSM_ACCESS_TOKEN_PROVIDER = new InjectionToken<AccessTokenProvider>('NGSSM_ACCESS_TOKEN_PROVIDER');
export const NGSSM_ACCESS_TOKEN_OBSERVABLE = new InjectionToken<Observable<string>>('NGSSM_ACCESS_TOKEN_OBSERVABLE');
export const publishAccessToken = (
  eventBus: NgssmEventBus,
  accessTokenProvider: AccessTokenProvider,
  accessTokenStore: AccessTokenStore
): void => {
  const token = accessTokenProvider.getAccessToken();
  accessTokenStore.accessToken = token;
  eventBus.publish(getAccessTokenEvent(token));
};

export const publishAccessTokenFactory = (): (() => void) => {
  const eventBus = inject(NgssmEventBus);
  const accessTokenProvider: AccessTokenProvider = inject(NGSSM_ACCESS_TOKEN_PROVIDER);
  const accessToken: Observable<string> = inject(NGSSM_ACCESS_TOKEN_OBSERVABLE);
  const accessTokenStore = inject(AccessTokenStore);
  const logger = inject(Logger);
  return () => {
    publishAccessToken(eventBus, accessTokenProvider, accessTokenStore);
    eventBus.event$.pipe(filter((e) => e.type === requestAccessTokenEvent)).subscribe(() => {
      publishAccessToken(eventBus, accessTokenProvider, accessTokenStore);
    });

    accessToken.subscribe((a) => {
      logger.information(`[publishAccessTokenFactory] New access token notified`);
      accessTokenStore.accessToken = a;
      eventBus.publish(getAccessTokenEvent(a));
    });
  };
};

export const provideNgssmElementForElementsHost = (
  accessTokenProviderType: Type<AccessTokenProvider>,
  accessTokenObservableFactory: () => () => Observable<string>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factoryDeps?: any[]
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_ACCESS_TOKEN_PROVIDER,
      useClass: accessTokenProviderType
    },
    {
      provide: NGSSM_ACCESS_TOKEN_OBSERVABLE,
      useFactory: accessTokenObservableFactory,
      deps: factoryDeps
    },
    provideAppInitializer(publishAccessTokenFactory())
  ]);
};
