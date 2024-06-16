import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/timer`

// 스터디의 타이머 불러오기
export const getTimers = async (studyNo) => {
    try {
        const res = await axios.get(`${prefix}/${studyNo}`);
        return res.data;
    } catch (error) {
        console.error('해당 스터디에는 타이머 기록이 하나도 없습니다.');
        return []; // 스터디에 타이머 기록이 아예 없으면 [] 반환
    }
}

// 타이머 새로 추가
export const addTimer = async (studyNo, timer) => {
    try {
        const res = await axios.post(`${prefix}/${studyNo}`, { ...timer, studyNo });
        return res.data;
    } catch (error) {
        console.error('타이머를 추가하는데 실패했습니다:', error);
        throw error;
    }
}

// 타이머 삭제
export const deleteTimer = async (studyNo, timerNo) => {
    try {
        const res = await axios.delete(`${prefix}/${studyNo}/${timerNo}`);
        return res.data;
    } catch (error) {
        console.error('타이머를 삭제하는데 실패했습니다:', error);
        throw error;
    }
}

// 타이머 데이터 수정
export const updateTimer = async (studyNo, timerNo, updatedTimer) => {
    try {
        const res = await axios.patch(`${prefix}/${studyNo}/${timerNo}`, updatedTimer);
        return res.data;
    } catch (error) {
        console.error('타이머를 업데이트하는데 실패했습니다:', error);
        throw error;
    }
}