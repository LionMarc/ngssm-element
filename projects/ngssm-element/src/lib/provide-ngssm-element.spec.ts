/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';

import {
  accessTokenEvent,
  AccessTokenProvider,
  getAccessTokenEvent,
  getRequestAccessTokenEvent,
  provideNgssmElementForElementsHost,
  provideNgssmElementForElementsProvider
} from './provide-ngssm-element';
import { AccessTokenStore } from './access-token-store';
import { NgssmEventBus } from './ngssm-event-bus';

describe('provide-ngssm-element', () => {
  describe('Host', () => {
    let accessTokenProvider: AccessTokenProvider;
    let accessTokenObservable: BehaviorSubject<string>;
    let accessTokenStore: AccessTokenStore;
    let eventBus: NgssmEventBus;
    let eventBusSpy: jasmine.Spy;
    let accessTokenProviderToken: string;

    beforeEach(async () => {
      accessTokenProviderToken = 'my-token';
      accessTokenProvider = {
        getAccessToken: () => accessTokenProviderToken
      };

      accessTokenObservable = new BehaviorSubject<string>('my-token');

      TestBed.configureTestingModule({
        providers: [
          provideNgssmElementForElementsHost(
            () => accessTokenProvider,
            () => accessTokenObservable
          )
        ]
      }).overrideProvider(NgssmEventBus, {
        useFactory: () => {
          eventBus = new NgssmEventBus();
          eventBusSpy = spyOn(eventBus, 'publish').and.callThrough();
          return eventBus;
        }
      });

      await TestBed.inject(ApplicationInitStatus).donePromise;

      accessTokenStore = TestBed.inject(AccessTokenStore);
    });

    describe('At startup', () => {
      it(`should update the token in the token store`, () => {
        expect(accessTokenStore.accessToken).toBe('my-token');
      });

      it(`should publish the token on the bus`, () => {
        expect(eventBus.publish).toHaveBeenCalledWith({
          type: accessTokenEvent,
          token: 'my-token'
        } as any);
      });
    });

    describe(`when a token is requested`, () => {
      beforeEach(() => {
        accessTokenProviderToken = 'requested-token';
        eventBusSpy.calls.reset();
        eventBus.publish(getRequestAccessTokenEvent());
      });

      it(`should publish the token on the bus`, () => {
        expect(eventBus.publish).toHaveBeenCalledWith({
          type: accessTokenEvent,
          token: 'requested-token'
        } as any);
      });
    });

    describe(`when the token is updated`, () => {
      beforeEach(() => {
        accessTokenProviderToken = 'token';
        eventBusSpy.calls.reset();
        accessTokenObservable.next('another-token');
      });

      it(`should publish the token on the bus`, () => {
        expect(eventBus.publish).toHaveBeenCalledWith({
          type: accessTokenEvent,
          token: 'another-token'
        } as any);
      });
    });
  });

  describe('Element', () => {
    let eventBus: NgssmEventBus;
    let accessTokenStore: AccessTokenStore;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [provideNgssmElementForElementsProvider()]
      }).overrideProvider(NgssmEventBus, {
        useFactory: () => {
          eventBus = new NgssmEventBus();
          spyOn(eventBus, 'publish').and.callThrough();
          return eventBus;
        }
      });

      await TestBed.inject(ApplicationInitStatus).donePromise;

      accessTokenStore = TestBed.inject(AccessTokenStore);
    });

    it(`should publish a request to get the token`, () => {
      expect(eventBus.publish).toHaveBeenCalledWith(getRequestAccessTokenEvent());
    });

    it(`should store the token in the token store when token is published`, () => {
      eventBus.publish(getAccessTokenEvent('new-token'));

      expect(accessTokenStore.accessToken).toBe('new-token');
    });
  });
});
