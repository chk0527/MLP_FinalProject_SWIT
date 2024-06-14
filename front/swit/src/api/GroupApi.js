import axios from "axios";
import { getUserIdFromToken } from "../util/jwtDecode";

export const API_SERVER_HOST = 'http://localhost:8181';
const prefix = `${API_SERVER_HOST}/api/group`;

// export const addGroup = async (studyObj) => {
//   const token = sessionStorage.getItem('accessToken');
//   if (!token) {
//     throw new Error('No access token found');
//   }

//   const res = await axios.post(`${prefix}/add`, studyObj, {
//     headers: {
//       Authorization: `${token}`,
//     }
//   });

//   return res.data;
// };
export const addGroup = async (groupData, answerData) => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
      throw new Error('No access token found');
  }

  const res = await axios.post(`${API_SERVER_HOST}/api/group/join`, 
      { group: groupData, answer: answerData },
      {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      }
  );
  return res.data;
};

export const isMember = async (userId, studyNo) => {
  const res = await axios.get(`${API_SERVER_HOST}/api/group/isMember`, {
    params: {userId, studyNo }
  });
  return res.data; // 여기서 승인 상태를 반환합니다
};

export const isLeader = async (studyNo) => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const userId = getUserIdFromToken();
  const res = await axios.get(`${prefix}/isLeader`, {
    headers: {
      Authorization:  `Bearer ${token}`
    },
    params: { userId, studyNo },
  });
  return res.data;
};

export const fetchGroupRequests = async (studyNo) => {
  const res = await axios.get(`${API_SERVER_HOST}/api/group/requests`, {
      params: { studyNo }
  });
  return res.data;
};

export const confirmGroupJoin = async (groupNo, approve) => {
  await axios.put(`${API_SERVER_HOST}/api/group/confirm`, null, {
      params: {
          groupNo,
          approve
      }
  });
};

export const memberCount = async (studyNo) => { //인원 수 체크
  const res = await axios.get(`/api/group/memberCount`, {
    params: {studyNo }
  });
  return res.data;
};


export const getUserAnswers = async (userId, studyNo) => {
  const res = await axios.get(`/api/answers`, {
    params: { userId, studyNo }
  });
  return res.data;
};



