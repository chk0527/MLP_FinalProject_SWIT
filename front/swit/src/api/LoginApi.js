import api from "./Api";
import axios from "axios";

export const API_SERVER_HOST = 'http://223.130.157.92:10527';
const prefix = `/snslogin`;

export const getOne = async () => {
    const res = await api.get(`${prefix}`);
    return res.data;
};

export const login = async (username, password) => {
  try {
    console.log("loginapi수정체크3");
    const response = await api.post(
      `/login?username=${username}&password=${password}`,
      {}, // 빈 객체를 요청 본문으로 보냅니다
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Login response:', response);

    // 헤더에서 토큰 값 추출
    let token = response.headers['authorization'];
    console.log('Full token:', token);
    
    if (token && token.startsWith('Bearer ')) {
      // 로컬 스토리지에 토큰 저장
      sessionStorage.setItem('accessToken', token);
      console.log('sessionStorage 저장된 토큰 값:', sessionStorage.getItem('accessToken'));
    }

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const info = () => api.get(`/login_user`);
export const join = (user) => api.post(`/join`, user);
export const remove = (userId) => api.delete(`/user/${userId}`);

export const searchId = (certifyType, userId, userName, userEmail, userPhone) =>
  api.get(`/confirm/userCheck?certifyType=${certifyType}&userId=${userId}&userName=${userName}&userEmail=${userEmail}&userPhone=${userPhone}`);

export const send_sms = (confirmDTO) => api.post(`/confirm/send`, confirmDTO);
export const searchId2 = (confirmDTO) => api.post(`/confirm/userCheck2`, confirmDTO);
