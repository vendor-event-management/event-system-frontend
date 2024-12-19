import { jwtDecode } from 'jwt-decode';
import { TOKEN_NAME } from './enums/token';

export const verify = () => {
  const token = JSON.parse(localStorage.getItem(TOKEN_NAME));
  return jwtDecode(token);
};
