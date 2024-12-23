import { jwtDecode } from 'jwt-decode';
import { TOKEN_NAME } from './enums/token';

export const verify = () => {
  const token = localStorage.getItem(TOKEN_NAME);

  if (!token) return false;

  try {
    const parsedToken = JSON.parse(token);
    return jwtDecode(parsedToken);
  } catch (error) {
    return false;
  }
};
