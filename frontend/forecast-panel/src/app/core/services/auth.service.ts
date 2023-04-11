import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, distinctUntilChanged, take } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

import { apiParameters } from '../../configs/api.params';
import { IUserModel, IUser } from '../models/user.model';
import { Role } from '../models/role';
import { IError } from '../models/error.model';
import { StorageService } from './storage/storage.service';
const userKey = 'currentUser';
const tokenKey = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  INIT_VALUE = null;

  private isAuthenticated$ = new BehaviorSubject<boolean>(this.INIT_VALUE);
  public isAuthenticated = this.isAuthenticated$.asObservable();

  private LoggedinUser$ = new BehaviorSubject<IUser>(this.INIT_VALUE);
  public LoggedinUser = this.LoggedinUser$.asObservable().pipe(
    distinctUntilChanged()
  );

  private userToken$ = new BehaviorSubject<string>(this.INIT_VALUE);
  public userToken = this.userToken$
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {}

  // TODO: Create autoLogout()

  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  public getToken() {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token');
    return of(token);
  }

  public get currentUserValue(): any {
    return this.LoggedinUser$.value;
  }

  public setUser(user: IUser) {
    this.LoggedinUser$.next(user);

    const token = this.userToken$.value;

    this.storage.saveUser(sessionStorage, JSON.stringify({ user, token }));
  }

  /**
   *  Login the user then tell all the subscribers about the new status
   */
  login(email: string, password: string) {
    return this.http
      .post(
        apiParameters.url + '/login',
        {
          email,
          password,
        },
        {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }
      )
      .pipe(
        tap((res: IUserModel) => {
          const token = res.token;
          const user = res.user;
          if (token) {
            const storage = sessionStorage;

            this.storage.saveUser(storage, JSON.stringify({ user, token }));
            this.storage.saveToken(storage, token);

            this.LoggedinUser$.next(user);
            this.userToken$.next(token);
            this.isAuthenticated$.next(true);
          }
        })
      );
  }

  /**
   * Log out the user then tell all the subscribers about the new status
   */
  logout(): void {
    this.storage.removeSessionObject(userKey);
    this.storage.removeSessionObject(tokenKey);
    this.storage.removeLocalObject(userKey);
    this.storage.removeLocalObject(tokenKey);

    this.isAuthenticated$.next(false);
    this.LoggedinUser$.next(null);
    this.userToken$.next(null);
  }

  autoLogin() {
    const userData: IUserModel = this.storage.getSessionObject(userKey);

    if (!userData) {
      this.isAuthenticated$.next(false);
      return;
    }

    this.userToken$.next(userData.token);
    this.LoggedinUser$.next(userData.user);
    this.isAuthenticated$.next(true);
  }
}
