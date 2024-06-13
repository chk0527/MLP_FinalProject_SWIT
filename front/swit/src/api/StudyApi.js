// 로컬 스토리지에서 토큰 가져오기
import axios from "axios";
export const API_SERVER_HOST = "http://localhost:8181";
const prefix = `${API_SERVER_HOST}/api/study`;

//스터디 전체 목록
export const getAllStudies = async (
  studyTitle,
  studySubject,
  studyAddr,
  studyOnline
) => {
  const res = await axios.get(`${prefix}/all`, {
    params: {
      studyTitle: studyTitle,
      studySubject: studySubject,
      studyAddr: studyAddr,
      studyOnline: studyOnline,
    },
  });
  return res.data;
};

// 스터디 하나
export const getStudy = async (studyNo) => {
  const res = await axios.get(`${prefix}/${studyNo}`);
  return res.data;
};

//스터디 추가
export const postAdd = async (study) => {
  const token = localStorage.getItem("accessToken");
  console.log("react LocalStorage Token값:" + token);
  if (!token) {
    throw new Error("No access token found");
  }
  const header = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `${token}`,
    },
  };
  const res = await axios.post(`${prefix}/`, study, header);
  return res.data;
};

//스터디 삭제
export const deleteOne = async (studyNo) => {
  const res = await axios.delete(`${prefix}/${studyNo}`);
  return res.data;
};

// ??
export const putOne = async (studyNo, study) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await axios.put(`${prefix}/${studyNo}`, study, header);
  return res.data;
};
