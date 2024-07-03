import axios from "axios";
export const API_SERVER_HOST = 'http://223.130.157.92:10527'
const prefix = `/api/board`

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

export const deleteOne = async (boardNo) => {
  const token = sessionStorage.getItem("accessToken");
  console.log("react sessionStorage Token값:" + token);
  if (!token) {
    throw new Error("No access token found");
  }
  const header = {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  };
  const res = await axios.delete(`${prefix}/${boardNo}`, header)
  return res.data;
}

export const putOne = async (board) => {
  const token = sessionStorage.getItem("accessToken");
  console.log("react sessionStorage Token값:" + token);
  if (!token) {
    throw new Error("No access token found");
  }
  const header = {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,
    },
  };
  const res = await axios.put(`${prefix}/${board.boardNo}`, board, header)
  return res.data;
}

export const getUserBoardList = async (userNo, pageParam) => {
  const { page, size } = pageParam
  const res = await axios.get(`${prefix}/list/${userNo}`, { params: { page: page, size: size } })
  return res.data;
}