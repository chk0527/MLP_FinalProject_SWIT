import axios from "axios"
import api from "./api"

export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/snslogin`

export const getOne = async () => {
    const res = await axios.get(`${prefix}`);
    return res.data;
}

// export const login = async (username, password) =>{
//     const res =await axios.post(`${API_SERVER_HOST}/login`, username, password)
//     return res.data
// }
export const login = async (username, password) => {
  try {
    const response = await api.post(`login?username=${username}&password=${password}`);
    console.log('Login response:', response);

    // 헤더에서 토큰 값 추출
    let token = response.headers['authorization'];
    console.log('Full token:', token);
    
    if (token && token.startsWith('Bearer ')) {
      // // 'Bearer ' 문자 제거
      // token = token.substring(7);      
      // 로컬 스토리지에 토큰 저장
      localStorage.setItem('accessToken', token);
      console.log('localStorage에 저장된 토큰 값:', localStorage.getItem('accessToken'));
    }

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};


export const info   = () => api.get(`/api/login_user`)
export const join   = (user) => api.post(`/api/join`, user)
export const remove = (userId) => api.delete(`/user/${userId}`)
