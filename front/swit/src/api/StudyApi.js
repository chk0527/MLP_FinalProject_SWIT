import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/study`

//
export const getStudy = async (studyNo) => {
    const res = await axios.get(`${prefix}/${studyNo}`);
    return res.data;
}