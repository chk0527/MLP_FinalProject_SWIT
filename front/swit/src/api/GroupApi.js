import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/group`

//그룹 테이블 관리를 위한 api

export const addGroup = async (studyObj) => {
    const res = await axios.post(`${prefix}/add`, studyObj)
    return res.data;
}
