import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  secretKey = "wJANI1KEGhIVPFO6SU82Odle8dOHniKH";
  constructor() { }

  encrypt(data: string, key: string = this.secretKey): string {
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  decrypt(data: string, key: string = this.secretKey) {
    try {
      return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
    }
    catch (err) {
      return data;
    }
  }
}