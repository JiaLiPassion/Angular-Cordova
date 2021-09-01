import { Injectable } from '@angular/core';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import * as localforage from 'localforage';

// Expire time in seconds
const TTL = 60 * 60;
// Key to identify only cached API data
const CACHE_KEY = '_mycached_';

@Injectable({
  providedIn: 'root'
})
export class CachingService {
  stores: any = {};
  constructor() {
    localforage.defineDriver(CordovaSQLiteDriver).then(() => {
      return localforage.setDriver([
        // tslint:disable-next-line:indent
        // Try setting cordovaSQLiteDriver if available,
        CordovaSQLiteDriver._driver,
        // otherwise use one of the default localforage drivers as a fallback.
        // This should allow you to transparently do your tests in a browser
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE
      ]);
    });
  }

  // Setup Ionic Storage
  async initStorage(name: string) {
    this.stores[name] = await localforage.createInstance({ name });
  }

  // Store request data
  cacheRequest(name, url, data): Promise<any> {
    const validUntil = (new Date().getTime()) + TTL * 1000;
    url = `${CACHE_KEY}${url}`;
    return this.stores[name].setItem(url, { validUntil, data });
  }

  // Try to load cached data
  async getCachedRequest(name, url): Promise<any> {
    const currentTime = new Date().getTime();
    url = `${CACHE_KEY}${url}`;

    const storedValue = await this.stores[name].getItem(url);

    if (!storedValue) {
      return null;
    } else if (storedValue.validUntil < currentTime) {
      await this.stores[name].removeItem(url);
      return null;
    } else {
      return storedValue.data;
    }
  }

  // Remove all cached data & files
  async dropStorage(name: string) {
    this.stores[name].dropInstance();
    this.stores[name] = undefined;
  }

  // Example to remove one cached URL
  async invalidateCacheEntry(name, url) {
    url = `${CACHE_KEY}${url}`;
    await this.stores[name].removeItem(url);
  }
}
