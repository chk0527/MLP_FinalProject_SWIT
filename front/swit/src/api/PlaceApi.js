import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/place`

//스터디 장소 하나
export const getPlaceDetail = async (placeNo) =>{
    const res =await axios.get(`${prefix}/${placeNo}`)
    return res.data
    }
// //스터디 장소 전체 목록 // 검색
// export const getPlaceList = async (placeName,placeAddr,pageParam) => {
//     const {PlacePage,PlaceSize} = pageParam
//     const res = await axios.get(`${prefix}/list`,{params:{placeName:placeName,placeAddr:placeAddr,PlacePage:PlacePage,PlaceSize:PlaceSize}});
//     return res.data;
// }

export const getPlaceList = async (token, placeName,placeAddr,pageParam) => {
    const {PlacePage,PlaceSize} = pageParam
    const res = await axios.get(`${prefix}/list`,{params:{placeName:placeName,placeAddr:placeAddr,PlacePage:PlacePage,PlaceSize:PlaceSize}
                                        , headers: {Authorization: token,},});
    return res.data;
}

// export const getPlaceSearch = async (placeName,placeAddr,pageParam) => {
//     const {PlacePage,PlaceSize} = pageParam
//     const res = await axios.get(`${prefix}/search/`,{params:{placeName:placeName,placeAddr:placeAddr,PlacePage:PlacePage,PlaceSize:PlaceSize}});
//     return res.data;
// }
