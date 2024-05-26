import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/user`

// 마이페이지 - 프로필 정보
export const getUserProfile = async (user_id) => {
    const res = await axios.get(`${prefix}/${user_id}`)
    return res.data
}