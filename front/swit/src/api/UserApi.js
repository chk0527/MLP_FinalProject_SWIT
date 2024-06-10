import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/user`

// 프로필 정보 조회 - 마이페이지 
export const getUserProfile = async (user_id) => {
    const res = await axios.get(`${prefix}/${user_id}`);
    return res.data;
}

// 프로필 정보 수정 - 모달창
export const putUserProfile = async (user) => {
    const res = await axios.put(`${prefix}/${user.user_id}`, user);
    return res.data;
}

// 프로필 이미지 업로드 - 모달창
export const postUserImage = async(user_id, formData) => {
    const header = { headers: { "Content-Type": "multipart/form-data" } };
    const res = await axios.post(`${prefix}/${user_id}/image`, formData, header);
    return res.data;
}

// 프로필 이미지 조회 - 마이페이지
export const getUserImage = async(user_id) => {
    // blob(Binary Large Object): 이미지/비디오/사운드 등의 멀티미디어 파일을 다루기 위한 타입 
    // responseType: 'blob' 지정 안하면, 마이페이지에서 미리보기 이미지의 url이 깨져서 나옴
    const res = await axios.get(`${prefix}/${user_id}/image`, { responseType: 'blob' });
    return URL.createObjectURL(res.data);
}