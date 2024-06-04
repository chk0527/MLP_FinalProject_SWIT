import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/study`

//
export const getStudy = async (studyNo) => {
    const res = await axios.get(`${prefix}/${studyNo}`);
    return res.data;
}

export const postAdd = async (studyObj) => {
    const res = await axios.post(`${prefix}/`, studyObj)
    return res.data;
}

export const getAllStudies = async () => {
  const res = await axios.get(`${prefix}/all`);
  return res.data;
}
