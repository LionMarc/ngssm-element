import { inject, Injectable, OnDestroy } from '@angular/core';
import { Logger } from 'ngssm-store';
import { Observable, Subject } from 'rxjs';

export interface NgssmEvent {
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class NgssmEventBus implements OnDestroy {
  private readonly logger = inject(Logger);
  private readonly customEventId = 'ngssm-element';
  private readonly _event$ = new Subject<NgssmEvent>();
  private readonly _eventHandler: EventListener;

  constructor() {
    this._eventHandler = (event) => {
      const detail: NgssmEvent = (event as CustomEvent).detail;
      this._event$.next(detail);
    };
    window.addEventListener(this.customEventId, this._eventHandler);
  }

  public get event$(): Observable<NgssmEvent> {
    return this._event$.asObservable();
  }

  public ngOnDestroy(): void {
    window.removeEventListener(this.customEventId, this._eventHandler);
  }

  public publish<T extends NgssmEvent>(event: T): void {
    this.logger.information(`Publishing event of type '${event.type}'`);
    const customEvent = new CustomEvent(this.customEventId, {
      detail: event
    });
    window.dispatchEvent(customEvent);
  }
}
