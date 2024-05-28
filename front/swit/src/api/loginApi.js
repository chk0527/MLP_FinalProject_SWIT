import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8080'
const prefix = `${API_SERVER_HOST}/api/login`

export const getOne = async (user_id) =>{
    const res =await axios.get(`${prefix}/${user_id}`)
    return res.data
}
