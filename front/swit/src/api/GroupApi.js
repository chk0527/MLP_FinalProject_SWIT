import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/group`

//그룹 테이블 관리를 위한 api

export const addGroup = async (studyObj) => {
  // 로컬 스토리지에서 토큰 가져오기
  const token = localStorage.getItem('accessToken');
  console.log(token+"@@@@@@@");
  if (!token) {
      throw new Error('No access token found');
  }

  // Axios 요청에 Authorization 헤더 추가
  const res = await axios.post(`${prefix}/add`, studyObj, {
      headers: {
          'Authorization': `${token}`
      }
  });

  return res.data;
};

export const isMember = async (studyNo) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  const res = await axios.get(`${API_SERVER_HOST}/api/group/isMember`, {
    params: {
      studyNo
    },
    headers: {
      'Authorization': `${token}`
    }
  });

  return res.data;
};
