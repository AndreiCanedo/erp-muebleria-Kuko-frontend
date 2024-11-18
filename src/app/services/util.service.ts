import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  formatCurrency(value: number): string { 
    return value.toLocaleString('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }); 
  }
}
