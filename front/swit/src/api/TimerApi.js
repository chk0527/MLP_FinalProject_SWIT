import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `/api/timer`

// 스터디의 타이머 불러오기
export const getAllTimers = async (studyNo) => {
    try {
        const res = await axios.get(`/api/timer/${studyNo}`);
        return res.data;
    } catch (error) {
        console.error('해당 스터디에는 타이머 기록이 하나도 없습니다.');
        return []; // 스터디에 타이머 기록이 아예 없으면 [] 반환
    }
}

// 그룹원의 타이머 불러오기
export const getUserTimers = async (studyNo, userNick) => {
    try {
        const res = await axios.get(`/api/timer/${studyNo}/${userNick}`);
        return res.data;
    } catch (error) {
        console.error('해당 스터디에는 타이머 기록이 하나도 없습니다.');
        return []; // 스터디에 타이머 기록이 아예 없으면 [] 반환
    }
}

// 타이머 새로 추가
export const addTimer = async (studyNo, userNick, timer) => {
    try {
        const res = await axios.post(`/api/timer/${studyNo}/${userNick}`, { ...timer, studyNo, userNick });
        return res.data;
    } catch (error) {
        console.error('타이머를 추가하는데 실패했습니다:', error);
        throw error;
    }
}

// 타이머 삭제
export const deleteTimer = async (studyNo, timerNo) => {
    try {
        const res = await axios.delete(`/api/timer/${studyNo}/${timerNo}`);
        return res.data;
    } catch (error) {
        console.error('타이머를 삭제하는데 실패했습니다:', error);
        throw error;
    }
}

// 타이머 데이터 수정
export const updateTimer = async (studyNo, timerNo, updatedTimer) => {
  const token = sessionStorage.getItem('accessToken');
  console.log("타이머의 토큰: "+{token});
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
    try {
        const res = await axios.patch(`/api/timer/${studyNo}/${timerNo}`, updatedTimer, config);
        return res.data;
    } catch (error) {
        console.error('타이머를 업데이트하는데 실패했습니다:', error);
        throw error;
    }
}