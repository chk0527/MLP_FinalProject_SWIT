import axios from "axios"
export const API_SERVER_HOST = 'http://223.130.157.92:10527'
const prefix = `${API_SERVER_HOST}/api/admin`

export const getUserList = async (pageParam) => {
    const { page, size } = pageParam
    const res = await axios.get(`${prefix}/list/user`, { params: { page: page, size: size } })
    return res.data
}