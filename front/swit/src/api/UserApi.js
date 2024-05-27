import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/user`

// 마이페이지 - 프로필 정보
export const getUserProfile = async (user_id) => {
    const res = await axios.get(`${prefix}/${user_id}`);
    return res.data;
}

// 모달창 - 프로필 수정
export const putUserProfile = async (user_id, user) => {
    const header = { headers: { "Content-Type": "multipart/form-data" } }
    const res = await axios.put(`${prefix}/modify/${user_id}`, user, header)
    return res.data;
}