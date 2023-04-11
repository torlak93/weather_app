import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { apiParameters } from '../../configs/api.params';
import { exhaustMap, take } from 'rxjs/operators';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    return this.authenticationService.userToken.pipe(
      take(1),
      exhaustMap(token => {
        // const currentUser = this.authenticationService.currentUserValue;
        // const isLoggedIn = currentUser && token;
        const isApiUrl = req.url.startsWith(apiParameters.urlOnly);

        if (token && isApiUrl) {
          req = req.clone({
            headers: req.headers.append('Authorization', `Bearer ${token}`)
          });

          const ignore =
            typeof req.body === 'undefined'
            || req.body === null
            || req.body.toString() === '[object FormData]'
            || req.headers.has('Content-Type');

          if (ignore) {
            return next.handle(req);
          }

          if (req.method === 'POST' || req.method === 'PATCH') {
            console.log('dodajem header...');
            req = req.clone({
              headers: req.headers.set('Content-Type', 'application/json')
            });
          }
        }
        // console.log(req.headers)
        return next.handle(req);
      })
    );

  }
}
