import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { from, map } from 'rxjs';
import { CurrencyData, CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit, AfterViewInit {

  @ViewChild('frm') frm : NgForm;
  toCurrencies : CurrencyData[] = [];
  fromCurrency : string = 'AUD';

  constructor(private currencyService : CurrencyService) {

  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    setTimeout(() => {//to read control values in template driven approach use setTimeout
      //or two way data binding
      console.log(this.frm);
      console.log(this.frm.form.controls.fromCurrency);//workaround to read control using template driven approach
      console.log(this.frm.form.controls.fromCurrency.value);
      this.currencyService.fetchCurrencies(this.fromCurrency).pipe(
        map((response : JSON) => {
            console.log(response);
            //let jsonResponse = JSON.parse(response);
            console.log(response['rates']);
            return response['rates'];
          }
        )
      )
      .subscribe((jsonResponse : JSON) => {
        console.log(jsonResponse);
        Object.keys(jsonResponse).forEach(k => {
          this.toCurrencies.push({ currencyName : k, rate : jsonResponse[k]  });
        });        
        console.log(this.toCurrencies);
      });
  
    });
  }

  onFormSubmit(frm : NgForm) : void {
    if(!frm.valid) {

    }

    let fromAmount = frm.form.controls['fromAmount'].value;
    let toCurrencyRate = frm.form.controls['toCurrency'].value;

    let convertedValue = this.currencyService.calculateConversion(fromAmount, toCurrencyRate);

    frm.controls['toAmount'].setValue(convertedValue);
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const allowedKeys = /[0-9.]/
    const inputChar = event.key;
  
    // Allow digits and one decimal point only
    if (!allowedKeys.test(inputChar)) {
      event.preventDefault();
      return false;
    }
  
    // Prevent more than one decimal point
    const inputElement = event.target as HTMLInputElement;
    if (inputChar === '.' && inputElement.value.includes('.')) {
      event.preventDefault();
      return false;
    }
  
    return true;
  }
  

}
