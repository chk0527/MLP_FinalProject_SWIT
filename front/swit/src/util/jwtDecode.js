import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = () => {
  const token = sessionStorage.getItem('accessToken');
  console.log(token+"!!!!!!!!!!");
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    return decoded.userId; // JWT 토큰에서 userId 필드 추출
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};
