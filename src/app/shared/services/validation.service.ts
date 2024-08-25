import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  //TODO Bill 30min Validation
  //TODO Users 2 Hours
  constructor() { }

  isSAID(id) {
    const regex = /^([0-9][0-9])([0][1-9]|[1][0-2])([0-2][0-9]|[3][0-1])([0-9])([0-9]{3})([0-9])([0-9])([0-9])$/;
    const regexValid = regex.test(id);
    if (!regexValid) {
      return false;
    }
    const validator = parseInt(id.charAt(12), 10);
    let oddTotal = 0;
    let evenNumber = '';
    for (let n = 0; n <= 11; n++) {
      if ((n + 1) % 2 === 0) {
        evenNumber += id.charAt(n);
      } else {
        oddTotal += parseInt(id.charAt(n), 10);
      }
    }
    let evenTotal = parseInt(evenNumber, 10) * 2;
    let evenTotalString = evenTotal.toString();
    let totalB = 0;
    for (let n = 0; n <= evenTotalString.length - 1; n++) {
      totalB += parseInt(evenTotalString.charAt(n), 10);
    }
    let totalC = oddTotal + totalB;
    let lastDigit = parseInt((totalC.toString()).slice(-1), 10);
    if (lastDigit !== 0) {
      lastDigit = 10 - lastDigit;
    }
    if (validator === lastDigit) {
      return true;
    } else {
      return false;
    }
  }
}
