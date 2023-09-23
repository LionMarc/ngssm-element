import { fakeAsync, tick } from '@angular/core/testing';

import { Logger } from 'ngssm-store';
import { NgssmEvent } from 'ngssm-element';

import { NgssmEventBus } from './ngssm-event-bus';

describe('NgssmEventBus', () => {
  let bus1: NgssmEventBus;
  let bus2: NgssmEventBus;

  beforeEach(() => {
    bus1 = new NgssmEventBus(new Logger());
    bus2 = new NgssmEventBus(new Logger());
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
