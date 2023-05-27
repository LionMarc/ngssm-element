import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

import { appConfig } from './app/app.config';
import { SimpleComponent } from './app/simple/simple.component';
import { SecondComponent } from './app/second/second.component';

createApplication(appConfig).then((appRef) => {
  const simple = createCustomElement(SimpleComponent, { injector: appRef.injector });
  customElements.define('ngssm-element-simple', simple);
  const second = createCustomElement(SecondComponent, { injector: appRef.injector });
  customElements.define('ngssm-element-second', second);
});
