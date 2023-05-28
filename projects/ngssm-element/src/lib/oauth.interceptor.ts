import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AccessTokenStore } from './access-token-store';

export const oAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AccessTokenStore).accessToken;
  if (!token) {
    return next(req);
  }

  const headers = req.headers.set('Authorization', `Bearer ${token}`);
  req = req.clone({
    headers
  });

  return next(req);
};
