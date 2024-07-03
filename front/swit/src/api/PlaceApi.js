import axios from "axios";
export const API_SERVER_HOST = "http://223.130.157.92:10527";
const prefix = `/api/place`;

//스터디 장소 하나
export const getPlaceDetail = async (placeNo) => {
  const res = await axios.get(`${prefix}/${placeNo}`);
  return res.data;
};

//스터디 장소 전체 (맵에 띄울 용)
export const getPlaceAllList = async () => {
  const res = await axios.get(`${prefix}/all`);
  return res.data;
};

//시험즐겨찾기
//추가
export const addPlaceFavorite = async (userId, placeNo) => {
  const res = await axios.post(`${prefix}/place/favorites`, { userId, placeNo });
  return res.data;
};

//삭제
export const removePlaceFavorite = async (userId, placeNo) => {
  const res = await axios.delete(`${prefix}/place/favorites`, {
    data: { userId, placeNo },
  });
  return res.data;
};

//확인
export const isPlaceFavorite = async (userId, placeNo) => {
  const res = await axios.get(`${prefix}/place/favorites`, {
    params: { userId, placeNo },
  });
  return res.data;
};

//즐겨찾기 전부 조회
export const getFavoritePlaces = async (userId) => {
  try {
    const res = await axios.get(`${prefix}/place/favorites/${userId}`);
    return res.data;
  } catch (error) {
    console.error('스터디 장소 즐겨찾기 조회 실패:', error);
    throw error;
  }
};
