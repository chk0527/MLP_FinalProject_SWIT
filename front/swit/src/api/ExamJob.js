import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api`

export const getExamList = async(pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/examjob/examlist`,{params:{page:page, size:size}})
    return res.data
}

export const getJobList = async(pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/examjob/joblist`,{params:{page:page, size:size}})
    return res.data
}