/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { take } from 'rxjs';

import { NgssmElementsLoaderService } from './ngssm-elements-loader.service';

import { RemoteCallStatus } from 'ngssm-remote-data';

describe('NgssmElementsLoaderService', () => {
  let service: NgssmElementsLoaderService;
  let document: Document;
  let script: { type: string; src: string; onload: () => void; onerror: (event: Event | string) => void };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgssmElementsLoaderService);
    document = TestBed.inject(DOCUMENT);

    service.addElementConfig({
      url: 'testing/one.js',
      names: ['one']
    });

    script = {
      type: '',
      src: '',
      onload: () => {
        // nothing here
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onerror: (event: Event | string) => {
        //nothing heer
      }
    };

    spyOn(document, 'createElement').and.returnValue(script as any);
    spyOn(document.body, 'appendChild');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(`adding an element config`, () => {
    it(`should return true when no element is registered for the url`, () => {
      const result = service.addElementConfig({
        url: 'testing/two.js',
        names: ['two']
      });

      expect(result).toBeTrue();
    });

    it(`should return false when an element is registered for the url`, () => {
      const result = service.addElementConfig({
        url: 'testing/one.js',
        names: ['two']
      });

      expect(result).toBeFalse();
    });
  });

  describe(`loading script`, () => {
    describe(`when script is not yet loaded`, () => {
      it(`should create a script element in the document`, () => {
        service.load('one');

        // eslint-disable-next-line deprecation/deprecation
        expect(document.createElement).toHaveBeenCalled();
      });

      it(`should return an InProgress status`, () => {
        service.load('one').subscribe((value) => expect(value.status).toEqual(RemoteCallStatus.inProgress));
      });

      it(`should set status to done when load is over`, () => {
        const observable = service.load('one');

        script.onload();

        observable.pipe(take(1)).subscribe((value) => expect(value.status).toEqual(RemoteCallStatus.done));
      });

      it(`should set status to ko when load fails`, () => {
        const observable = service.load('one');

        script.onerror('error');

        observable.pipe(take(1)).subscribe((value) => expect(value.status).toEqual(RemoteCallStatus.ko));
      });
    });

    describe(`when script is already loaded`, () => {
      beforeEach(() => {
        service.load('one');
        script.onload();
      });

      it(`should not create a script element in the document`, () => {
        // eslint-disable-next-line deprecation/deprecation
        (document.createElement as any).calls.reset();
        service.load('one');

        // eslint-disable-next-line deprecation/deprecation
        expect(document.createElement).not.toHaveBeenCalled();
      });
    });
  });
});
