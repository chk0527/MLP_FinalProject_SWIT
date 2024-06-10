import axios from "axios"

export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/examjob`

export const getExamList = async (pageParam) => {
    const { page, size } = pageParam
    const res = await axios.get(`${prefix}/examlist`, { params: { page: page, size: size } })
    return res.data
}

//목록&검색
export const getJobList = async (pageParam) => {
    const { page, size, searchKeyword } = pageParam;

    const params = { page: page, size: size };
    if (searchKeyword) {
        params.searchKeyword = searchKeyword;
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
    return res;
}
