import { Injectable } from '@angular/core';
import { ValidationErrors, ValidatorFn, AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GlobalValidatorService {

  constructor() { }

  // Custom regex validator
  regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (!control.value) {
        return null;
      }
      const isWhitespace = (control.value.toString() || '').trim().length === 0;
      // Whitespace detect
      if(isWhitespace) {
        control.setValue(null);
        return error;
      } else {
        const valid = regex.test(control.value.toString().trim());
        return valid ? null : error;
      }
    };
  }

  // Password and Confirm password matcher
  passwordMatcher(): ValidatorFn {
    return (control: FormGroup): any => {
    const pass = control.get('password');
    const confirm = control.get('password2');
    return pass && confirm && pass.value !== confirm.value ? { notMatch: true } : null;
     }
  }

    // To validate all fields after submit
    validateAllFormArrays(formArray: FormArray) {
      formArray.controls.forEach(formGroup => {
        Object.keys(formGroup['controls']).forEach(field => {
          const control = formGroup.get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {
            this.validateAllFields(control);
          }
        });

      });
    }

    // To validate all fields in the form group
    validateAllFields(formGroup: FormGroup) {
     return Object.keys(formGroup.controls).forEach(field => {
        // formGroup.get(field).setValue(formGroup.get(field).value ? formGroup.get(field).value.trim() : formGroup.get(field).value); // This line of code will trim the whitespaces before and after before validate
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFields(control);
        }
      });
    }

    // To trim the form group
    cleanForm(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach((field) => formGroup.get(field).setValue(formGroup.get(field).value ? formGroup.get(field).value.trim() : formGroup.get(field).value));
    }

    /* ****************  Define all your regex validators below ************* */
    // Alpha numberic with ',' '.' are allowed, Maximum lenth allowed is 30 characters
    alphaNum50() {
      const alphaNumericwithCommonSpecialCharactersMaxLength30: RegExp = /^([a-zA-Z0-9_ \-,.\r\n]){0,50}$/;
      return this.regexValidator(alphaNumericwithCommonSpecialCharactersMaxLength30, {alphaNum50: true});
    }

    alphaNum255() {
      const alphaNumericwithCommonSpecialCharactersMaxLength30: RegExp = /^([a-zA-Z0-9_ \-,.\r\n]){0,244}$/;
      return this.regexValidator(alphaNumericwithCommonSpecialCharactersMaxLength30, {alphaNum255: true});
    }

    address255() {
      const address255: RegExp = /^([a-zA-Z0-9_ \-,.:;/\r\n|\r|\n/]){0,255}$/;
      return this.regexValidator(address255, {address255: true});
    }

    offer() {
      const offer: RegExp = /^([a-zA-Z0-9_ \-,.:;&/\r\n|\r|\n/]){0,255}$/;
      return this.regexValidator(offer, {offer: true});
    }

    address50() {
      const address50: RegExp = /^([a-zA-Z0-9_ \-,.:;/\r\n|\r|\n/]){0,49}$/;
      return this.regexValidator(address50, {address50: true});
    }

    // Email pattern regex
    email() {
      const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return this.regexValidator(emailregex, {email: true});
    }
    passwordRegex(){
      const passwordHard: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.\(\)\{\}\[\]\:\;\<\>\,\?\/\\\~\_\+\-\=\|])(?=.{0,})/gm;
      return this.regexValidator(passwordHard, {password: true});
    }

    mobileRegex() {
      const mobileRegex: RegExp = /^[6-9][0-9]{9}$/;
      return this.regexValidator(mobileRegex, {mobileRegex: true});
    }

    numberOnly() {
      const numberOnly: RegExp = /^[0-9]*$/;
      return this.regexValidator(numberOnly, {numberOnly: true});
    }

    zipOnly() {
      const zipOnly: RegExp = /^[0-9]{6}$/;
      return this.regexValidator(zipOnly, {zipOnly: true});
    }

    alphaNum10() {
      const alphaNum10: RegExp = /^([a-zA-Z0-9_ ]){0,10}$/;
      return this.regexValidator(alphaNum10, {alphaNum10: true});
    }

    panNo() {
      const panNo: RegExp = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
      return this.regexValidator(panNo, {panNo: true});
    }
    passport(){
      const passport: RegExp = /^[A-Z]{1}[0-9]{7}$/;
      return this.regexValidator(passport, {passport: true});
    }
    licence(){
      const licence: RegExp = /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
      return this.regexValidator(licence, {licence: true});
    }
    numberDecimals() {
      const numberDecimals: RegExp = /^\d*(\.\d{0,2})?$/;
      return this.regexValidator(numberDecimals, {numberDecimals: true});
    }

    eyenumberDecimals() {
      const eyenumberDecimals: RegExp = /^[\-\+]?[0-9]{1,2}\d*(\.\d{0,2})?$/;
      return this.regexValidator(eyenumberDecimals, {eyenumberDecimals: true});
    }

    bloodGroup() {
      const bloodGroup: RegExp = /^[\-\+]?[a-zA-Z0-9_ ]{1,2}\d*(\.\d{0,2})?$/;
      return this.regexValidator(bloodGroup, {bloodGroup: true});
    }

    aadhaar() {
      const aadhaar: RegExp = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
      return this.regexValidator(aadhaar, {aadhaar: true});
    }

    backlog() {
      const backlog: RegExp = /^[0-9][0-9]{0,1}$/;
      return this.regexValidator(backlog, {backlog: true});
    }

    percentage() {
      const percentage = /(^100(\.0{1,2})?$)|(^(?:[2-9]\d|\d{2}?)(\.[0-9]{1,2})?$)/;
      return this.regexValidator(percentage, {percentage: true});
    }

}
