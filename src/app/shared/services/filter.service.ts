import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  type = null;
  filterUpdated = new EventEmitter<string>();
  valueUpdated = new EventEmitter<string>();

  setFilter(type) {
    this.type = type;
    this.filterUpdated.emit(this.type);
  }
  updateFilter(value) {
    this.valueUpdated.emit(value);
  }
}
