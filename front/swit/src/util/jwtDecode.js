import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    return decoded.userId; // JWT 토큰에서 userId 필드 추출
  } catch (error) {
    console.error('Error decoding JWT token[jwtDecode]:', error);
    return null;
  }
};

export const getUserNickFromToken = () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    return decoded.userNick; // JWT 토큰에서 userNick 필드 추출
  } catch (error) {
    console.error('Error decoding JWT token[jwtDecode]:', error);
    return null;
  }
};

export const getUserNoFromToken = () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    return decoded.userNo; // JWT 토큰에서 userNo 필드 추출
  } catch (error) {
    console.error('Error decoding JWT token[jwtDecode]:', error);
    return null;
  }
};

export const getUserRoleFromToken = () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.userRole;
};
