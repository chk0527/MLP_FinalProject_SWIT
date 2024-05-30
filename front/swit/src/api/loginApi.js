import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/login`

export const getOne = async () => {
    const res = await axios.get(`${prefix}/`);
    return res.data;
}

export const postOne = async (userObj) =>{
    const res =await axios.post(`${prefix}/`, userObj)
    return res.data
}
