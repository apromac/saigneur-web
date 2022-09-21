import server from '../assets/data/server.json';

console.log(server);

export const environment = {
  production: true,
  baseHref: server.baseHref,
  apiUrl: server.protocol + server.address + ':' + server.port + '/' +  server.approot + 'api/v1/',
  apiCandidatUrl: server.protocol + server.address + ':' + server.portCdt + '/' +  server.approot + 'api/v1/',
  apiUserUrl: server.protocol + server.address + ':' + server.portUser + '/' +  server.approot + 'api/v1/',
};
