import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/place`

//스터디 장소 하나
export const getPlaceDetail = async (placeNo) =>{
    const res =await axios.get(`${prefix}/${placeNo}`)
    return res.data
    }
//스터디 장소 전체 목록
export const getPlaceList = async (pageParam) => {
    const {PlacePage,PlaceSize} = pageParam
    const res = await axios.get(`${prefix}/list`,{params:{PlacePage:PlacePage,PlaceSize:PlaceSize}});
    return res.data;
}
