import axios from "axios"
export const API_SERVER_HOST = 'http://localhost:8181'
const prefix = `${API_SERVER_HOST}/api/calendar`

// 스터디의 캘린더(모든 일정) 불러오기
export const getCalendar = async (studyNo) => {
    try {
        const res = await axios.get(`${prefix}/${studyNo}`);
        return res.data;
    } catch (error) {
        console.error('해당 스터디에는 일정(캘린더)이 하나도 없습니다.');
        return []; // 스터디에 캘린더 일정이 아예 없으면 [] 반환
    }
}

// 캘린더(일정) 새로 추가
export const addEvent = async (studyNo, event) => {
    const res = await axios.post(`${prefix}/${studyNo}`, { ...event, studyNo });
    return res.data;
}

// 캘린더(일정) 삭제
export const deleteEvent = async (studyNo, eventId) => {
    const res = await axios.delete(`${prefix}/${studyNo}/${eventId}`);
    return res.data;
}

// 캘린더(일정) 업데이트
// 데이터들이 수정된 일정 객체를 반환
export const updateEvent = async (studyNo, eventId, updatedEvent) => {
    const res = await axios.patch(`${prefix}/${studyNo}/${eventId}`, updatedEvent);
    return res.data;
}
