import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/study`
// 로컬 스토리지에서 토큰 가져오기
const token = localStorage.getItem('accessToken');
console.log("react LocalStorage Token값:" +token);
if (!token) {
    throw new Error('No access token found');
}
//
export const getStudy = async (studyNo) => {
  const res = await axios.get(`${prefix}/${studyNo}`);
  return res.data;
}

export const getStudyWithQuestion = async (studyNo) => {
  const res = await axios.get(`${prefix}/question/${studyNo}`);
  return res.data;
}

export const postAdd = async (study) => {
  const header = { headers: { "Content-Type": "multipart/form-data", 'Authorization': `${token}` } }
  const res = await axios.post(`${prefix}/`, study, header)
  return res.data;
}

export const getAllStudies = async () => {
  const res = await axios.get(`${prefix}/all`);
  return res.data;
}

export const deleteOne = async(studyNo) =>{
  const res = await axios.delete(`${prefix}/${studyNo}`)
  return res.data;
}

export const putOne = async(studyNo, study) =>{
  const header = { headers: { "Content-Type": "multipart/form-data" } }
  const res = await axios.put(`${prefix}/${studyNo}`, study, header)
  return res.data;
}