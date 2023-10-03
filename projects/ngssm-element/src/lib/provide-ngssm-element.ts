import { APP_INITIALIZER, EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { Observable, filter } from 'rxjs';

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
    {
      provide: APP_INITIALIZER,
      useFactory: requestAndStoreAccessToken,
      deps: [NgssmEventBus, AccessTokenStore],
      multi: true
    }
  ]);
};

export interface AccessTokenProvider {
  getAccessToken(): string;
}

export const NGSSM_ACCESS_TOKEN_PROVIDER = new InjectionToken<AccessTokenProvider>('NGSSM_ACCESS_TOKEN_PROVIDER');
export const NGSSM_ACCESS_TOKEN_OBSERVABLE = new InjectionToken<Observable<string>>('NGSSM_ACCESS_TOKEN_OBSERVABLE');
export const publishAccessToken = (eventBus: NgssmEventBus, accessTokenProvider: AccessTokenProvider): void => {
  const token = accessTokenProvider.getAccessToken();
  eventBus.publish(getAccessTokenEvent(token));
};

export const publishAccessTokenFactory = (
  eventBus: NgssmEventBus,
  accessTokenProvider: AccessTokenProvider,
  accessToken: Observable<string>
): (() => void) => {
  return () => {
    publishAccessToken(eventBus, accessTokenProvider);
    eventBus.event$.pipe(filter((e) => e.type === requestAccessTokenEvent)).subscribe(() => {
      publishAccessToken(eventBus, accessTokenProvider);
    });

    accessToken.subscribe((a) => eventBus.publish(getAccessTokenEvent(a)));
  };
};

export const provideNgssmElementForElementsHost = (
  accessTokenProvider: AccessTokenProvider,
  accessToken: Observable<string>
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_ACCESS_TOKEN_PROVIDER,
      useValue: accessTokenProvider
    },
    {
      provide: NGSSM_ACCESS_TOKEN_OBSERVABLE,
      useValue: accessToken
    },
    {
      provide: APP_INITIALIZER,
      useFactory: publishAccessTokenFactory,
      deps: [NgssmEventBus, NGSSM_ACCESS_TOKEN_PROVIDER, NGSSM_ACCESS_TOKEN_OBSERVABLE],
      multi: true
    }
  ]);
};
