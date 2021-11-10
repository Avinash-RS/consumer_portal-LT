import { Injectable } from '@angular/core';
import { ValidationErrors, ValidatorFn, AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GlobalValidatorsService {

  constructor() { }

  // Custom regex validator
  regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (!control.value) {
        return null;
      }
      const isWhitespace = (control.value || '').trim().length === 0;
      // Whitespace detect
      if(isWhitespace) {
        control.setValue(control.value.trim());
        return {required: true};
      } else {
        const valid = regex.test(control.value.trim());
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

    // To validate all fields in the form group
    validateAllFields(formGroup: FormGroup) {
     return Object.keys(formGroup.controls).forEach(field => {
        formGroup.get(field).setValue(formGroup.get(field).value ? formGroup.get(field).value.trim() : formGroup.get(field).value); // This line of code will trim the whitespaces before and after before validate
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
    alphaNum30() {
      const alphaNumericwithCommonSpecialCharactersMaxLength30: RegExp = /^([a-zA-Z0-9_ \-,.\r\n]){0,30}$/;
      return this.regexValidator(alphaNumericwithCommonSpecialCharactersMaxLength30, {alphaNum30: true});
    }
     // Alpha numberic with ',' '.' are allowed, Maximum lenth allowed is 30 characters
    mobile() {
      // const alphaNumericwithCommonSpecialCharactersMaxLength30: RegExp = /^([0-9_ \-,.\r\n]){0,10}$/;
      const alphaNumericwithCommonSpecialCharactersMaxLength30: RegExp = /[1-9]{1}[0-9]{9}/;
      // const alphaNumericwithCommonSpecialCharactersMaxLength30: RegExp = /^\+[1-9]{1}[0-9]{3,14}$/;
      return this.regexValidator(alphaNumericwithCommonSpecialCharactersMaxLength30, {alphaNum30: true});
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
}
