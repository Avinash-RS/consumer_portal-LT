// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  dev: true,
  qa: false,
  uat: false,
  blobKey : "?sv=2018-03-28&ss=b&srt=sco&sp=racwdl&st=2021-04-20T06%3A59%3A57Z&se=2171-04-20T07%3A04%3A58Z&spr=https%2Chttp&sig=3TBFQu369yom4bQ8%2FqEjxIqGiqjGwAO%2Bb2V5hfAevt8%3D",
  sso:'http://52.172.236.38:3015',
  // Dev base url
  API_BASE_URL: 'https://edgeportal.lntiggnite.com/', 
  PAYMENT:'https://devpayment.lntiggnite.com' ,
  uap:'https://uap-dev.lntiggnite.com',
  unifiedReport_URL :'https://unifiedreport-dev.lntedutech.com/',
  lxp_url:'https://lmsdev.lntiggnite.com/redirection',
  captachaSiteKey: '6Lf-qfEcAAAAAH2zsrdDz1K6DmUOHjgHzGmH3PN7',
  userOrigin:'learner'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
