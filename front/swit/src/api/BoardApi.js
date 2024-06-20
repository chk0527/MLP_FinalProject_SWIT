import axios from "axios";
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/board`

export const getBoard = async (boardNo) => {
  const res = await axios.get(`${prefix}/${boardNo}`);
  return res.data;
}

export const postAdd = async (board) => {
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
  const res = await axios.post(`${prefix}/`, board, header);
  return res.data;
};

export const getBoardList = async (pageParam) => {
  const { page, size } = pageParam
  const res = await axios.get(`${prefix}/list`, { params: { page: page, size: size } })
  return res.data;
}