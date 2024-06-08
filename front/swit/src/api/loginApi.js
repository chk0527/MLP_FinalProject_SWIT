import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/login`

export const getOne = async () => {
    const res = await axios.get(`${prefix}/`);
    return res.data;
}

export const postOne = async (username, password) =>{
    const res =await axios.post(`${API_SERVER_HOST}/login`, username, password)
    return res.data
}
