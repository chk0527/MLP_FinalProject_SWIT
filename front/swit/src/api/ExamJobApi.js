import axios from "axios"

export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/examjob`

export const getExamList = async (pageParam) => {
    const { page, size, searchKeyword } = pageParam;

    const params = {page: page, size: size}
    if(searchKeyword){
        params.searchKeyword = searchKeyword;
    }
    const res = await axios.get(`${prefix}/examlist`, { params })
    return res.data
}

//목록&검색
export const getJobList = async (pageParam) => {
    const { page, size, searchKeyword, jobField, sort } = pageParam;

    const params = { page: page, size: size };
    if (searchKeyword) {
        params.searchKeyword = searchKeyword;
    }
    if (jobField) {
        params.jobField = jobField;
    }
    if (sort) {
        params.sort = sort;
    }

    const res = await axios.get(`${prefix}/joblist`, { params });
    return res.data;
}



export const getExamRead = async (examNo) => {
    const res = await axios.get(`${prefix}/exam/${examNo}`)
    return res.data
}

export const getJobRead = async (jobNo) => {
    const res = await axios.get(`${prefix}/job/${jobNo}`)
    return res.data
}

export const getExamAll = async() => {
    const res = await axios.get(`${prefix}/examAll`)
    return res.data;
}


//시험즐겨찾기

//추가
export const addExamFavorite = async (userId, examNo) => {
    const res = await axios.post(`${prefix}/exam/favorites`, { userId, examNo });
    return res.data;
};

//삭제
export const removeExamFavorite = async (userId, examNo) => {
    const res = await axios.delete(`${prefix}/exam/favorites`, { data: { userId, examNo } });
    return res.data;
};

//확인
export const isExamFavorite = async (userId, examNo) => {
    const res = await axios.get(`${prefix}/exam/favorites`, { params: { userId, examNo } });
    return res.data;
};


//채용즐겨찾기

//추가
export const addJobFavorite = async (userId, jobNo) => {
    const res = await axios.post(`${prefix}/job/favorites`, { userId, jobNo });
    return res.data;
};

//삭제
export const removeJobFavorite = async (userId, jobNo) => {
    const res = await axios.delete(`${prefix}/job/favorites`, { data: { userId, jobNo } });
    return res.data;
};

//확인
export const isJobFavorite = async (userId, jobNo) => {
    const res = await axios.get(`${prefix}/job/favorites`, { params: { userId, jobNo } });
    return res.data;
};

//캘린더 -> 즐겨찾기만
export const getFavoriteExams = async (userId) => {
    try {
      const response = await axios.get(`/api/examjob/exam/favorites/${userId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

