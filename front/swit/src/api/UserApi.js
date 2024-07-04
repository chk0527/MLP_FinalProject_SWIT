import axios from "axios"
export const API_SERVER_HOST = 'http://223.130.157.92:10527'
const prefix = `/api/user`

// 프로필 정보 조회 - 마이페이지 
export const getUserProfile = async (userId) => {
    const res = await axios.get(`${prefix}/${userId}`);
    return res.data;
}

// 프로필 정보 수정 - 모달창
export const putUserProfile = async (user) => {
    const res = await axios.put(`${prefix}/${user.userId}`, user);
    return res.data;
}

// 프로필 이미지 업로드 - 모달창
export const postUserImage = async(userId, formData) => {
    const header = { headers: { "Content-Type": "multipart/form-data" } };
    const res = await axios.post(`${prefix}/${userId}/image`, formData, header);
    return res.data;
}

// 프로필 이미지 조회 - 마이페이지
export const getUserImage = async(userId) => {
    // blob(Binary Large Object): 이미지/비디오/사운드 등의 멀티미디어 파일을 다루기 위한 타입 
    // responseType: 'blob' 지정 안하면, 마이페이지에서 미리보기 이미지의 url이 깨져서 나옴
    const res = await axios.get(`${prefix}/${userId}/image`, { responseType: 'blob' });
    return URL.createObjectURL(res.data);
}

// 수정 중복 체크
export const checkDuplicate = async ({ userNick, userPhone, userEmail, currentUserId }) => {
  const response = await axios.get(`/api/user/check_duplicate`, {
      params: {
          userNick,
          userPhone,
          userEmail,
          currentUserId,
      },
  });
  return response.data;
};
