// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import server from '../assets/data/server.json';

console.log(server);

export const environment = {
  production: false,
  baseHref: server.baseHref,
  apiUrl: server.protocol + server.address + ':' + server.port + '/' +  server.approot + 'api/v1/',
  apiCandidatUrl: server.protocol + server.address + ':' + server.portCdt + '/' +  server.approot + 'api/v1/',
  apiUserUrl: server.protocol + server.address + ':' + server.portUser + '/' +  server.approot + 'api/v1/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
