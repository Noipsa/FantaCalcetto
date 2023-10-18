import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  showLoader: boolean = false;
  loaderChange: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  setShow(showLoader: boolean) {
    this.showLoader = showLoader;
    this.loaderChange.emit(this.showLoader);
  }
}
