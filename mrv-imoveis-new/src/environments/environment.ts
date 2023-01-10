// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  apiUrl: "https://www.mrv.com.br/apimobile/api",
  // ga_key: '220641006',
  ga_key: '242752229',
  whatsUrl: 'https://www.mrv.com.br/whats',
  firebaseConfig: {
    apiKey: "AIzaSyBSW511lPtjPAZYj8u9TlAsl7dzLEjIbNM",
    authDomain: "compre-seu-mrv-openmrv.firebaseapp.com",
    databaseURL: "https://compre-seu-mrv-openmrv.firebaseio.com",
    projectId: "compre-seu-mrv-openmrv",
    storageBucket: "compre-seu-mrv-openmrv.appspot.com",
    messagingSenderId: "221712471398",
    appId: "1:221712471398:web:99971b744af3f8d00464a7",
    measurementId: "G-53B6Q1BNFZ"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
