import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CachingService } from './cache.service';

function dataURItoBlob(dataURI) {
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const byteString = atob(dataURI.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([intArray], { type: mimeString });
}

function blobToDataURI(blob): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => {
      res(e.target.result as string);
    };
    reader.onerror = e => {
      rej(e);
    };
    reader.readAsDataURL(blob);
  });
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cachedString1: string;
  cachedString2: string;
  cachedImg1: any;
  cachedImg2: any;
  constructor(private cachingService: CachingService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  saveString(db) {
    this.cachingService.cacheRequest(db, 'string', 'test');
  }

  async getString(db) {
    if (db === 'db1') {
      this.cachedString1 = await this.cachingService.getCachedRequest(db, 'string');
    } else {
      this.cachedString2 = await this.cachingService.getCachedRequest(db, 'string');
    }
  }

  async getBlob(db) {
    if (db === 'db1') {
      this.cachedImg1 = this.sanitizer.bypassSecurityTrustUrl(`${await this.cachingService.getCachedRequest(db, 'blob')}`);
    } else {
      this.cachedImg2 = this.sanitizer.bypassSecurityTrustUrl(`${await this.cachingService.getCachedRequest(db, 'blob')}`);
    }
  }

  async createDb(db) {
    this.cachingService.initStorage(db);
  }

  async dropDb(db) {
    this.cachingService.dropStorage(db);
  }

  onFileChanged(db, event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fr = new FileReader();
      fr.onload = (evt) => {
        const base64: any = evt.target.result;
        this.cachingService.cacheRequest(db, 'blob', base64);
      };
      fr.readAsDataURL(file);
    }
  }
}
