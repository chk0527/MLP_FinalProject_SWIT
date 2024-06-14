import axios from "axios";
export const API_SERVER_HOST = "http://localhost:8181";
const prefix = `${API_SERVER_HOST}/api/study`;
// 로컬 스토리지에서 토큰 가져오기

export const getStudy = async (studyNo) => {
  const res = await axios.get(`${prefix}/${studyNo}`);
  return res.data;
}

export const getStudyWithQuestion = async (studyNo) => {
  const res = await axios.get(`${prefix}/question/${studyNo}`);
  return res.data;
}

export const postAdd = async (study) => {
  const token = sessionStorage.getItem("accessToken");
  console.log("react sessionStorage Token값:" + token);
  if (!token) {
    throw new Error("No access token found");
  }
  const header = {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`,
    },
  };
  const res = await axios.post(`${prefix}/`, study, header);
  return res.data;
};

export const getAllStudies = async () => {
  const res = await axios.get(`${prefix}/all`);
  return res.data;
};

export const deleteOne = async (studyNo) => {
  const res = await axios.delete(`${prefix}/${studyNo}`);
  return res.data;
};

export const putOne = async (studyNo, study) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await axios.put(`${prefix}/${studyNo}`, study, header);
  return res.data;
};

export const fetchInquiries = async (studyNo) => { //스터디 문의 등록
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const res = await axios.get(`${prefix}/${studyNo}/inquiries`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const inquirySubmit = async (studyNo, inquiryContent) => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const res = await axios.post(`${prefix}/${studyNo}/inquiries`, { inquiryContent }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const responseSubmit = async (inquiryNo, responseContent) => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const res = await axios.post(`${prefix}/inquiries/${inquiryNo}/responses`, { responseContent }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};