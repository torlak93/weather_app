import { Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private _util: UtilService
  ) { }

  saveUser(storage, data) {
    storage.setItem('currentUser', this._util.encrypt(data));
    // storage.setItem('currentUser', data);
  }

  saveToken(storage, data) {
    storage.setItem('token', data);
  }

  setLocalObject(key: string, value: any) {
    localStorage.setItem(key, this._util.encrypt(value));
    // localStorage.setItem(key, value);
  }

  setSessionObject(key: string, value: any) {
    sessionStorage.setItem(key, this._util.encrypt(value));
    // sessionStorage.setItem(key, value);
  }

  getLocalObject(key: string) {
    return localStorage.getItem(key) ?
      JSON.parse(this._util.decrypt(localStorage.getItem(key)))
      : null;
  }

  getSessionObject(key: string) {
    return sessionStorage.getItem(key) ?
      JSON.parse(this._util.decrypt(sessionStorage.getItem(key)))
      : null;
  }

  removeLocalObject(key: string) {
    localStorage.removeItem(key);
  }

  removeSessionObject(key: string) {
    sessionStorage.removeItem(key);
  }
}