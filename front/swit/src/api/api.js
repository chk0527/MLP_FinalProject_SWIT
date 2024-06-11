import axios from "axios";

// axios 객체 생성
const api = axios.create({
    baseURL: 'http://localhost:8181',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;