// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  dev: true,
  qa: false,
  uat: false,
  blobKey : "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2221-11-23T19:12:41Z&st=2021-11-23T11:12:41Z&spr=https,http&sig=R6%2BlZGrzjuFs1aAy2uUG%2BNkjVig5%2F8disv01i86VK8M%3D",
  sso:'http://52.172.236.38:3015',
  // Dev base url
  API_BASE_URL: 'https://edgeservice.lntiggnite.com/', 
  PAYMENT:'https://devpayment.lntiggnite.com' ,
  uap:'https://uap-dev.lntiggnite.com'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
