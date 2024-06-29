import axios from "axios"
export const API_SERVER_HOST = 'http://223.130.157.92:10527'
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

// 캘린더(일정) 데이터 수정
// 데이터들이 수정된 일정 객체를 반환
export const updateEvent = async (studyNo, eventId, updatedEvent) => {
  const token = sessionStorage.getItem('accessToken');
  const config = {
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }};
    const res = await axios.patch(`/api/calendar/${studyNo}/${eventId}`, updatedEvent, config);
    return res.data;
}
