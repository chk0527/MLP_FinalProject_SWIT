import axios from "axios"
import api from "./Api"

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
      sessionStorage.setItem('accessToken', token);
      console.log('sessionStorage 저장된 토큰 값:', sessionStorage.getItem('accessToken'));
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


// export const searchId   = (certifyType, userId, userName, userEmail, userPhone) => {
//   console.log("axios certifyType " + certifyType);
//   console.log("axios userid " + userId);
//   console.log("axios name " + userName);
//   console.log("axios userEmail " + userEmail);
//   console.log("axios phone " + userPhone);
//   const res = axios.get(`/api/confirm/userCheck?certifyType=${certifyType}&userId=${userId}&userName=${userName}$userEmail=${userEmail}&userPhone=${userPhone}`)
//   // const res = axios.get('/api/confirm/userCheck', requestData);
//   return res.data;
// }
  
  // , {headers: {
  //   'Content-Type': 'application/json'
  // }}

// 아이디 찾기 : 핸드폰 번호 검증 -> 회원 확인 및 인증번호 생성
export const searchId   = (certifyType, userId, userName, userEmail, userPhone) => axios.get(`/api/confirm/userCheck?certifyType=${certifyType}&userId=${userId}&userName=${userName}&userEmail=${userEmail}&userPhone=${userPhone}`)
// export const searchId = (certifyType, userId, userName, userEmail, userPhone) => {
//   // const { certifyType, userId, userName, userEmail, userPhone } = requestData;
//   return axios.get(`/api/confirm/userCheck?certifyType=${certifyType}&userId=${id}&userName=${name}&userEmail=${email}&userPhone=${phone}`);
// };

// 아이디 찾기 : 핸드폰 번호 검증 -> 인증번호 발송
// export const send_sms   = (confirmDTO) => axios.get(`/api/confirm/send`, confirmDTO)
export const send_sms = (confirmDTO) => {
  const { certifyType, userId, userName, userEmail, userPhone } = confirmDTO;
  return api.post(`/api/confirm/send`, confirmDTO);
};

// 아이디 찾기 : 핸드폰 번호 검증 -> 인증번호 확인
export const searchId2   = (confirmDTO) => {
  const { confirmNo, userId, confirmTarget, confirmPath, confirmNum, confirmLimitDate } = confirmDTO;
  return api.post(`/api/confirm/userCheck2`, confirmDTO);
}
