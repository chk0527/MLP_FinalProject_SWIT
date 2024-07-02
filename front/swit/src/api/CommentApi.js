import axios from "axios";
export const API_SERVER_HOST = "http://localhost:8181";
const prefix = `${API_SERVER_HOST}/api/comment`;

export const postAdd = async (comment) => {
    const token = sessionStorage.getItem("accessToken");
    console.log("react sessionStorage Token값:" + token);
    if (!token) {
      throw new Error("No access token found");
    }
    const header = {
      headers: {
        // "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    };
    const res = await axios.post(`${prefix}/`, comment, header);
    return res.data;
  };

  export const getComments = async (boardNo) => {
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
    const res = await axios.get(`${prefix}/board/${boardNo}`, header);
    return res.data;
};

export const deleteComment = async (commentNo) => {
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
  const res = await axios.delete(`${prefix}/${commentNo}`, header)
  return res.data;
}