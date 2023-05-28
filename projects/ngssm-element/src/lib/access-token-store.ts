import { Injectable } from '@angular/core';

import { WithAccessToken } from './with-access-token';

@Injectable({
  providedIn: 'root'
})
export class AccessTokenStore implements WithAccessToken {
  accessToken: string | null | undefined;
}
