import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  updateData(item: string, data: any): void {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    localStorage.setItem(item, data);
  }

  getData(item: string): any {
    return JSON.parse(localStorage.getItem(item));
  }

  removeData(item: string): void {
    localStorage.removeItem(item);
  }

  clearStorage(): void {
    localStorage.clear();
  }

}
