import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  inject,
  provideAppInitializer
} from '@angular/core';
import { Observable, filter } from 'rxjs';

import { Logger } from 'ngssm-store';

import { NgssmEvent, NgssmEventBus } from './ngssm-event-bus';
import { AccessTokenStore } from './access-token-store';

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

export const requestAndStoreAccessToken = () => {
  const eventBus = inject(NgssmEventBus);
  const accessTokenStore = inject(AccessTokenStore);

  eventBus.event$.pipe(filter((e) => e.type === accessTokenEvent)).subscribe((e) => {
    accessTokenStore.accessToken = (e as AccessTokenEvent).token;
  });
  eventBus.publish(getRequestAccessTokenEvent());
};

export const provideNgssmElementForElementsProvider = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideAppInitializer(requestAndStoreAccessToken)]);
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

export const publishAccessTokenFactory = () => {
  const eventBus = inject(NgssmEventBus);
  const accessTokenProvider: AccessTokenProvider = inject(NGSSM_ACCESS_TOKEN_PROVIDER);
  const accessToken: Observable<string> = inject(NGSSM_ACCESS_TOKEN_OBSERVABLE);
  const accessTokenStore = inject(AccessTokenStore);
  const logger = inject(Logger);

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

export const provideNgssmElementForElementsHost = (
  accessTokenProviderFactory: () => AccessTokenProvider,
  accessTokenObservableFactory: () => Observable<string>
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_ACCESS_TOKEN_PROVIDER,
      useFactory: accessTokenProviderFactory
    },
    {
      provide: NGSSM_ACCESS_TOKEN_OBSERVABLE,
      useFactory: accessTokenObservableFactory
    },
    provideAppInitializer(publishAccessTokenFactory)
  ]);
};
