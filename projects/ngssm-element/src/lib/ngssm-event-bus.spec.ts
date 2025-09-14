import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NgssmEvent } from 'ngssm-element';

import { NgssmEventBus } from './ngssm-event-bus';
import { InjectionToken } from '@angular/core';

const firstBus = new InjectionToken<NgssmEventBus>('firstBus');
const secondBus = new InjectionToken<NgssmEventBus>('secondBus');

describe('NgssmEventBus', () => {
  let bus1: NgssmEventBus;
  let bus2: NgssmEventBus;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: firstBus,
          useFactory: () => new NgssmEventBus()
        },
        {
          provide: secondBus,
          useFactory: () => new NgssmEventBus()
        }
      ]
    });

    bus1 = TestBed.inject(firstBus);
    bus2 = TestBed.inject(secondBus);
  });

  afterEach(() => {
    bus1.ngOnDestroy();
    bus2.ngOnDestroy();
  });

  it('should received message published by another instance', (done) => {
    bus2.event$.subscribe((e) => {
      expect(e.type).toEqual('testing');
      done();
    });
    bus1.publish({ type: 'testing' });
  });

  it('should unregister when destroyed', fakeAsync(() => {
    const events: NgssmEvent[] = [];
    bus2.event$.subscribe((e) => events.push(e));
    bus2.ngOnDestroy();
    bus1.publish({ type: 'testing' });
    tick(100);

    expect(events.length).toEqual(0);
  }));
});
