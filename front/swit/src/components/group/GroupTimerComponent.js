import { useState, useEffect } from 'react';
import axios from 'axios';
import { getTimer, addTimer, deleteTimer, updateTimer } from '../../api/TimerApi';

const GroupTimerComponent = ({ studyNo }) => {
    const [timers, setTimers] = useState([])
    const [currentTimer, setCurrentTimer] = useState(null)
    const [currentStopwatch, setCurrentStopwatch] = useState(null)
    const [intervalId, setIntervalId] = useState(null)

    useEffect(() => {
        // studyNo에 따른 타이머/스톱워치 불러오기
        const fetchTimers = async () => {
            const response = await getTimer(studyNo);
            setTimers(response);
        }
        fetchTimers()
    }, [studyNo])

    // 스톱워치 및 타이머 동작 중일 때 매 10초마다 정보 업데이트
    useEffect(() => {
        if (currentStopwatch && currentStopwatch.running) {
            const id = setInterval(() => {
                setCurrentStopwatch(prev => {
                    const updatedTime = prev.time + 10
                    return { ...prev, time: updatedTime }
                })
            }, 10)
            setIntervalId(id)
        } else if (currentTimer && currentTimer.running) {
            const id = setInterval(() => {
                setCurrentTimer(prev => {
                    const updatedTime = prev.time - 10
                    if (updatedTime <= 0) {
                        clearInterval(id)
                        return { ...prev, running: false, time: 0 }
                    }
                    return { ...prev, time: updatedTime }
                })
            }, 10)
            setIntervalId(id)
        } else {
            clearInterval(intervalId)
        }
        return () => clearInterval(intervalId)
    }, [currentStopwatch, currentTimer])


    // 새로운 타이머 생성
    const handleCreateTimer = async (type) => {
        const newTimer = { studyNo, type, title: '', content: '', time: type === 'timer' ? 1800 : 0, running: false }
        const res = await addTimer(studyNo, newTimer)
        setTimers([...timers, res])
        if (type === 'stopwatch') setCurrentStopwatch(res)
        if (type === 'timer') setCurrentTimer(res)
    }


    // ================== "스톱워치" 기능 핸들러 =========================

    // 스톱워치 시작
    const handleStartStopwatch = async (timer) => {
        const updatedTimer = { ...timer, running: true }
        const res = await updateTimer(studyNo, timer.timerNo, updatedTimer);
        setCurrentStopwatch(res)
    }

    // 스톱워치 일시정지
    const handlePauseStopwatch = async (timer) => {
        const updatedTimer = { ...timer, running: false }
        const res = await updateTimer(studyNo, timer.timerNo, updatedTimer)
        setCurrentStopwatch(res)
    }

    // 스톱워치 정지 및 초기화
    const handleStopStopwatch = async (timer) => {
        const updatedTimer = { ...timer, running: false, time: 0 }
        const res = await updateTimer(studyNo, timer.timerNo, updatedTimer);
        setCurrentStopwatch(res)
    }

    // ================== "타이머" 기능 핸들러 =========================

    // 타이머 시작
    const handleStartTimer = async (timer) => {
        const updatedTimer = { ...timer, running: true }
        const res = await updateTimer(studyNo, timer.timerNo, updatedTimer)
        setCurrentTimer(res)
    }

    // 타이머 일시정지
    const handlePauseTimer = async (timer) => {
        const updatedTimer = { ...timer, running: false }
        const res = await updateTimer(studyNo, timer.timerNo, updatedTimer)
        setCurrentTimer(res)
    }

    // 타이머 정지 및 초기화
    const handleStopTimer = async (timer) => {
        const updatedTimer = { ...timer, running: false, time: 0 }
        const res = await updateTimer(studyNo, timer.timerNo, updatedTimer)
        setCurrentTimer(res)
    }

    // 타이머 삭제
    const handleDeleteTimer = async (timer) => {
        await deleteTimer(studyNo, timer.timerNo)
        setTimers(timers.filter(t => t.timerNo !== timer.timerNo))
        if (timer.type === 'stopwatch') setCurrentStopwatch(null)
        if (timer.type === 'timer') setCurrentTimer(null)
    }

    return (
        <div className="p-4 flex flex-col items-center">
            {/* 스톱워치 섹션 */}
            <div className="bg-white p-4 mb-4 w-full">
                <h2>스톱워치</h2>
                {!currentStopwatch ? (
                    <button onClick={() => handleCreateTimer('stopwatch')}>스톱워치 생성</button>
                ) : (
                    <div>
                        <input type="text" placeholder="제목" value={currentStopwatch.title} onChange={(e) => setCurrentStopwatch({ ...currentStopwatch, title: e.target.value })} />
                        <input type="text" placeholder="상세내용" value={currentStopwatch.content} onChange={(e) => setCurrentStopwatch({ ...currentStopwatch, content: e.target.value })} />
                        <div>
                            {new Date(currentStopwatch.time).toISOString().slice(11, 23)}
                        </div>
                        {!currentStopwatch.running ? (
                            <button onClick={() => handleStartStopwatch(currentStopwatch)} className="bg-purple-500">시작</button>
                        ) : (
                            <>
                                <button onClick={() => handlePauseStopwatch(currentStopwatch)} className="bg-blue-500">일시정지</button>
                                <button onClick={() => handleStopStopwatch(currentStopwatch)} className="bg-red-500">정지</button>
                            </>
                        )}
                        <button onClick={() => handleDeleteTimer(currentStopwatch)} className="bg-gray-500">삭제</button>
                    </div>
                )}
            </div>

            {/* 타이머 섹션 */}
            <div className="bg-white p-4 mb-4 w-full">
                <h2>타이머</h2>
                {!currentTimer ? (
                    <button onClick={() => handleCreateTimer('timer')}>타이머 생성</button>
                ) : (
                    <div>
                        <input type="text" placeholder="제목" value={currentTimer.title} onChange={(e) => setCurrentTimer({ ...currentTimer, title: e.target.value })} />
                        <div>
                            <label>시</label>
                            <input type="number" value={Math.floor(currentTimer.time / 3600)} onChange={(e) => setCurrentTimer({ ...currentTimer, time: e.target.value * 3600 + (currentTimer.time % 3600) })} />
                            <label>분</label>
                            <input type="number" value={Math.floor((currentTimer.time % 3600) / 60)} onChange={(e) => setCurrentTimer({ ...currentTimer, time: Math.floor(currentTimer.time / 3600) * 3600 + e.target.value * 60 + (currentTimer.time % 60) })} />
                            <label>초</label>
                            <input type="number" value={currentTimer.time % 60} onChange={(e) => setCurrentTimer({ ...currentTimer, time: Math.floor(currentTimer.time / 3600) * 3600 + Math.floor((currentTimer.time % 3600) / 60) * 60 + parseInt(e.target.value, 10) })} />
                        </div>
                        <div>
                            {new Date(currentTimer.time * 1000).toISOString().slice(11, 19)}
                        </div>
                        {!currentTimer.running ? (
                            <button onClick={() => handleStartTimer(currentTimer)} className="bg-purple-500">시작</button>
                        ) : (
                            <>
                                <button onClick={() => handlePauseTimer(currentTimer)} className="bg-blue-500">일시정지</button>
                                <button onClick={() => handleStopTimer(currentTimer)} className="bg-red-500">정지</button>
                            </>
                        )}
                        <button onClick={() => handleDeleteTimer(currentTimer)} className="bg-gray-500">삭제</button>
                    </div>
                )}
            </div>

            {/* 알람 섹션 */}
            <div className="bg-white p-4 mb-4 w-full">
                <h2>알람</h2>
                <p>알람 기능은 곧 추가됩니다.</p>
            </div>
        </div>
    );
};

export default GroupTimerComponent;