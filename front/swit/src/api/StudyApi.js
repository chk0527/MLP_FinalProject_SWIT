import axios from "axios";
export const API_SERVER_HOST = 'http://223.130.157.92:10527'
const prefix2 = `${API_SERVER_HOST}/api/study`
const prefix = `/api/study`;
// 로컬 스토리지에서 토큰 가져오기

export const getStudy = async (studyNo) => {
  console.log("getStudy APi파일 호출");
  const res = await axios.get(`/api/study/${studyNo}`);
  return res.data;
}

export const getMyStudy = async (userId) => { //내가 가입한 스터디 목록
  const res = await axios.get(`/api/study/myStudy`, {
    params: { userId }
  });
  return res.data;
};

export const getStudyWithQuestion = async (studyNo) => {
  const res = await axios.get(`/api/study/question/${studyNo}`);
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
  //수정체크
  const res = await axios.post(`/api/study/`, study, header);
  return res.data;
};

export const getAllStudies = async (studyTitle, studySubject, studyAddr, studyOnline, userId, pageParam) => {
  const { StudyPage, StudySize } = pageParam
  const res = await axios.get(`/api/study/all`, { params: { studyTitle: studyTitle, studySubject: studySubject, studyAddr: studyAddr, studyOnline: studyOnline, userId: userId, StudyPage: StudyPage, StudySize: StudySize } });
  return res.data;
};




export const deleteOne = async (studyNo) => {
  const res = await axios.delete(`/api/study/${studyNo}`);
  return res.data;
};

export const putOne = async (studyNo, study) => {
  const res = await axios.put(`${prefix}/${studyNo}`, study, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};




export const fetchInquiries = async (studyNo) => {
  const token = sessionStorage.getItem('accessToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await axios.get(`/api/study/${studyNo}/inquiries`, { headers });
  console.log(res.data+"@@");
  return res.data;
};

export const inquirySubmit = async (studyNo, inquiryContent) => { //문의 등록
  console.log(inquiryContent + "!!!!");
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const res = await axios.post(`/api/study/${studyNo}/inquiries`, { inquiryContent }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const deleteInquiry = async (inquiryNo) => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const res = await axios.delete(`/api/study/inquiries/${inquiryNo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const responseSubmit = async (inquiryNo, responseContent) => { //답변 등록
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const res = await axios.post(`/api/study/inquiries/${inquiryNo}/responses`, { responseContent }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// 사용자가 작성한 문의글 조회
export const getUserInquiries = async (userId, pageParam) => {
  const token = sessionStorage.getItem('accessToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { page, size } = pageParam;
  try {
    const res = await axios.get(`${prefix}/list/${userId}/inquiries`, {
      headers,
      params: { page: page, size: size }
    });
    return res.data;
  } catch (error) {
    console.error('사용자가 작성한 문의글 조회 실패:', error);
    throw error;
  }
};