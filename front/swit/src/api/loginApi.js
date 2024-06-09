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

export const login  = (username, password) => api.post(`login?username=${username}&password=${password}`)
export const info   = () => api.get(`/login_user`)
export const join   = (data) => api.post(`/join`, data)
export const remove = (userId) => api.delete(`/user/${userId}`)
