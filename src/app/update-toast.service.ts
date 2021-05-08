import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateToastService {

  data: any = {};
  private dataObs$ = new Subject();

  constructor() { }

  updateData(data: any): void {
    this.dataObs$.next(data);
  }

  getData(): any {
    return this.dataObs$;
  }

}
