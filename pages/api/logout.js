import { removeAuthCookies } from './helpers/cookie';

export default async function handler(_request, response) {
  removeAuthCookies(response);
  response.end();
}
