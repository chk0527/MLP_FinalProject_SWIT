import { useState, useEffect, useRef } from 'react';
import { getTimers, addTimer, deleteTimer, updateTimer } from '../../api/TimerApi';
import { FaStopwatch, FaClock, FaBell } from 'react-icons/fa';

const GroupTimerComponent = ({ studyNo }) => {
    // 타이머 및 스톱워치 상태 관리
    const [timers, setTimers] = useState([]);
    const [currentTimer, setCurrentTimer] = useState(null);
    const [currentStopwatch, setCurrentStopwatch] = useState(null);
    const intervalTimerId = useRef(null);  // 타이머용 interval ID
    const intervalStopWatchId = useRef(null);  // 스톱워치용 interval ID

    // studyNo에 따른 타이머/스톱워치 불러오기
    useEffect(() => {
        const fetchTimers = async () => {
            try {
                const response = await getTimers(studyNo)
                setTimers(response)

                // 로컬 스토리지에서 복원
                const savedStopwatch = JSON.parse(localStorage.getItem(`currentStopwatch_${studyNo}`))
                const savedTimer = JSON.parse(localStorage.getItem(`currentTimer_${studyNo}`))

                // (스탑워치) 로컬 스토리지의 상태가 DB에 있는지 확인
                if (savedStopwatch) {
                    const fetchedStopwatch =
                        response.find(timer => timer.timerNo === savedStopwatch.timerNo)
                    if (fetchedStopwatch) {
                        setCurrentStopwatch(fetchedStopwatch)
                        if (fetchedStopwatch.running) {
                            handleStartStopwatch(fetchedStopwatch)
                        }
                    } else {
                        localStorage.removeItem(`currentStopwatch_${studyNo}`)
                    }
                }
                // (타이머) 로컬 스토리지의 상태가 DB에 있는지 확인
                if (savedTimer) {
                    const fetchedTimer =
                        response.find(timer => timer.timerNo === savedTimer.timerNo)
                    if (fetchedTimer) {
                        setCurrentTimer(fetchedTimer)
                        if (fetchedTimer.running) {
                            handleStartTimer(fetchedTimer)
                        }
                    } else {
                        localStorage.removeItem(`currentTimer_${studyNo}`)
                    }
                }
            } catch (error) {
                console.error('타이머를 불러오는 데 실패했습니다:', error)
            }
        }
        fetchTimers()
    }, [studyNo])

    // 타이머 및 스톱워치 상태 저장
    useEffect(() => {
        const saveState = () => {
            if (currentStopwatch) {
                localStorage.setItem(`currentStopwatch_${studyNo}`, JSON.stringify(currentStopwatch))
            }
            if (currentTimer) {
                localStorage.setItem(`currentTimer_${studyNo}`, JSON.stringify(currentTimer))
            }
        }

        window.addEventListener('beforeunload', saveState)
        return () => {
            window.removeEventListener('beforeunload', saveState)
        }
    }, [currentStopwatch, currentTimer, studyNo])

    // 서버를 끌 때 일시정지 처리
    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [currentStopwatch, currentTimer])

    const handleBeforeUnload = async () => {
        if (currentStopwatch && currentStopwatch.running) {
            const updatedTimer = { ...currentStopwatch, running: false }
            setCurrentStopwatch(updatedTimer)
            await updateTimer(studyNo, currentStopwatch.timerNo, updatedTimer)
            localStorage.setItem(`currentStopwatch_${studyNo}`, JSON.stringify(updatedTimer))
        }
        if (currentTimer && currentTimer.running) {
            const updatedTimer = { ...currentTimer, running: false }
            setCurrentTimer(updatedTimer)
            await updateTimer(studyNo, currentTimer.timerNo, updatedTimer)
            localStorage.setItem(`currentTimer_${studyNo}`, JSON.stringify(updatedTimer))
        }
    }

    // 타이머 시간을 포맷팅하는 함수
    const formatTimerTime = (time) => {
        const hours = String(Math.floor(time / 3600)).padStart(2, '0')
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0')
        const seconds = String(time % 60).padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    }

    // 스톱워치 시간을 포맷팅하는 함수
    const formatStopWatchTime = (time) => {
        const hours = String(Math.floor(time / 3600000)).padStart(2, '0')
        const minutes = String(Math.floor((time % 3600000) / 60000)).padStart(2, '0')
        const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0')
        const milliseconds = String(Math.floor((time % 1000) / 10)).padStart(2, '0')
        return `${hours}:${minutes}:${seconds}:${milliseconds}`
    }

    // 새로운 타이머 생성
    const handleCreateTimer = async (type) => {
        const newTimer = {
            studyNo,
            type,
            title: '',
            content: '',
            time: type === 'timer' ? 1800 : 0,
            running: false
        }
        try {
            const res = await addTimer(studyNo, newTimer)
            setTimers([...timers, res])
            if (type === 'stopwatch') setCurrentStopwatch(res)
            if (type === 'timer') setCurrentTimer(res)
        } catch (error) {
            console.error('타이머 생성 실패 : ', error)
        }
    }

    // 타이머 삭제
    const handleDeleteTimer = async (timer) => {
        try {
            clearInterval(timer.type === 'stopwatch' ? intervalStopWatchId.current : intervalTimerId.current)
            await deleteTimer(studyNo, timer.timerNo)
            setTimers(timers.filter(t => t.timerNo !== timer.timerNo))
            if (timer.type === 'stopwatch') {
                setCurrentStopwatch(null)
                localStorage.removeItem(`currentStopwatch_${studyNo}`)
            }
            if (timer.type === 'timer') {
                setCurrentTimer(null)
                localStorage.removeItem(`currentTimer_${studyNo}`)
            }
        } catch (error) {
            console.error('타이머 삭제 실패 : ', error)
        }
    }

    // ================== "스톱워치" 기능 핸들러 =========================

    const handleStartStopwatch = async (timer) => {
        try {
            if (intervalStopWatchId.current) {
                clearInterval(intervalStopWatchId.current)
            }

            const updatedTimer = { ...timer, running: true }
            setCurrentStopwatch(updatedTimer)

            const startTime = Date.now() - timer.time
            intervalStopWatchId.current = setInterval(() => {
                const updatedTime = Date.now() - startTime
                setCurrentStopwatch(prev => {
                    const newTimer = { ...prev, time: updatedTime }
                    localStorage.setItem(`currentStopwatch_${studyNo}`, JSON.stringify(newTimer))
                    return newTimer
                })
            }, 10)

            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('스톱워치 시작 오류 : ', error)
        }
    }

    const handlePauseStopwatch = async (timer) => {
        try {
            clearInterval(intervalStopWatchId.current)
            const updatedTimer = {
                ...timer,
                running: false,
                updatedAt: new Date().toISOString()
            }
            setCurrentStopwatch(updatedTimer)
            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('스톱워치 일시정지 실패 : ', error)
        }
    }

    const handleStopStopwatch = async (timer) => {
        try {
            clearInterval(intervalStopWatchId.current)
            const updatedTimer = {
                ...timer,
                running: false,
                time: 0,
                updatedAt: new Date().toISOString()
            }
            setCurrentStopwatch(updatedTimer)
            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('스톱워치 정지 실패 : ', error)
        }
    }

    // ================== "타이머" 기능 핸들러 =========================

    const handleStartTimer = async (timer) => {
        try {
            if (intervalTimerId.current) {
                clearInterval(intervalTimerId.current)
            }

            const updatedTimer = { ...timer, running: true }
            setCurrentTimer(updatedTimer)

            const startTime = Date.now()
            intervalTimerId.current = setInterval(() => {
                const updatedTime = timer.time - Math.floor((Date.now() - startTime) / 1000)
                if (updatedTime <= 0) {
                    clearInterval(intervalTimerId.current)
                    const finalTimer = { ...updatedTimer, running: false, time: 0, updatedAt: new Date().toISOString() }
                    setCurrentTimer(finalTimer)
                    localStorage.removeItem(`currentTimer_${studyNo}`)
                    updateTimer(studyNo, timer.timerNo, finalTimer)
                } else {
                    setCurrentTimer(prev => {
                        const newTimer = { ...prev, time: updatedTime }
                        localStorage.setItem(`currentTimer_${studyNo}`, JSON.stringify(newTimer))
                        return newTimer
                    })
                }
            }, 1000)

            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('타이머 시작 실패 : ', error)
        }
    }

    const handlePauseTimer = async (timer) => {
        try {
            clearInterval(intervalTimerId.current)
            const updatedTimer = {
                ...timer,
                running: false,
                updatedAt: new Date().toISOString()
            }
            setCurrentTimer(updatedTimer)
            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('타이머 일시정지 실패 : ', error)
        }
    }

    const handleStopTimer = async (timer) => {
        try {
            clearInterval(intervalTimerId.current)
            const updatedTimer = {
                ...timer,
                running: false,
                time: 0,
                updatedAt: new Date().toISOString()
            }
            setCurrentTimer(updatedTimer)
            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('타이머 정지/초기화 실패 : ', error)
        }
    }

    return (
        <div className="flex flex-col md:flex-row justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
            <div className="bg-gray-200 p-4 w-full md:w-1/3 flex flex-col items-center rounded-lg h-full">
                <FaStopwatch className="text-4xl mb-2" />
                <h2 className="text-2xl font-semibold mb-4">스톱워치</h2>
                {!currentStopwatch ? (
                    <button
                        onClick={() => handleCreateTimer('stopwatch')}
                        className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
                    >
                        스톱워치 생성
                    </button>
                ) : (
                    <div className="space-y-4 w-full">
                        <input
                            type="text"
                            placeholder="제목"
                            value={currentStopwatch.title}
                            onChange={(e) => setCurrentStopwatch({ ...currentStopwatch, title: e.target.value })}
                            disabled={currentStopwatch.running}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            placeholder="상세내용"
                            value={currentStopwatch.content}
                            onChange={(e) => setCurrentStopwatch({ ...currentStopwatch, content: e.target.value })}
                            disabled={currentStopwatch.running}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <div className="text-3xl font-mono text-center">{formatStopWatchTime(currentStopwatch.time)}</div>
                        <div className="flex justify-center space-x-2">
                            {!currentStopwatch.running ? (
                                <button
                                    onClick={() => {
                                        if (!currentStopwatch.title || !currentStopwatch.content) {
                                            alert("제목과 상세내용을 입력하세요.");
                                        } else {
                                            handleStartStopwatch(currentStopwatch);
                                        }
                                    }}
                                    className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
                                >
                                    시작
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handlePauseStopwatch(currentStopwatch)}
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                                    >
                                        일시정지
                                    </button>
                                    <button
                                        onClick={() => handleStopStopwatch(currentStopwatch)}
                                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                                    >
                                        정지
                                    </button>
                                </>
                            )}
                            {!currentStopwatch.running && (
                                <button
                                    onClick={() => handleDeleteTimer(currentStopwatch)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-gray-200 p-4 w-full md:w-1/3 flex flex-col items-center rounded-lg h-full">
                <FaClock className="text-4xl mb-2" />
                <h2 className="text-2xl font-semibold mb-4">타이머</h2>
                {!currentTimer ? (
                    <button
                        onClick={() => handleCreateTimer('timer')}
                        className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
                    >
                        타이머 생성
                    </button>
                ) : (
                    <div className="space-y-4 w-full">
                        <input
                            type="text"
                            placeholder="제목"
                            value={currentTimer.title}
                            onChange={(e) => setCurrentTimer({ ...currentTimer, title: e.target.value })}
                            disabled={currentTimer.running}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            placeholder="상세내용"
                            value={currentTimer.content}
                            onChange={(e) => setCurrentTimer({ ...currentTimer, content: e.target.value })}
                            disabled={currentTimer.running}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {!currentTimer.running ? (
                            <div className="grid grid-cols-3 gap-2 justify-center">
                                <label className="flex flex-col items-center">
                                    시
                                    <input
                                        type="number"
                                        value={Math.floor(currentTimer.time / 3600)}
                                        onChange={(e) =>
                                            setCurrentTimer({
                                                ...currentTimer,
                                                time: e.target.value * 3600 + (currentTimer.time % 3600),
                                            })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </label>
                                <label className="flex flex-col items-center">
                                    분
                                    <input
                                        type="number"
                                        value={Math.floor((currentTimer.time % 3600) / 60)}
                                        onChange={(e) =>
                                            setCurrentTimer({
                                                ...currentTimer,
                                                time: Math.floor(currentTimer.time / 3600) * 3600 + e.target.value * 60 + (currentTimer.time % 60),
                                            })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </label>
                                <label className="flex flex-col items-center">
                                    초
                                    <input
                                        type="number"
                                        value={currentTimer.time % 60}
                                        onChange={(e) =>
                                            setCurrentTimer({
                                                ...currentTimer,
                                                time: Math.floor(currentTimer.time / 3600) * 3600 + Math.floor((currentTimer.time % 3600) / 60) * 60 + parseInt(e.target.value, 10),
                                            })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="text-3xl font-mono text-center">{formatTimerTime(currentTimer.time)}</div>
                        )}
                        <div className="flex justify-center space-x-2">
                            {!currentTimer.running ? (
                                <button
                                    onClick={() => {
                                        if (!currentTimer.title || !currentTimer.content || currentTimer.time < 1) {
                                            alert("제목과 상세내용을 입력하고 시간은 1초 이상이어야 합니다.");
                                        } else {
                                            handleStartTimer(currentTimer);
                                        }
                                    }}
                                    className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
                                >
                                    시작
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handlePauseTimer(currentTimer)}
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                                    >
                                        일시정지
                                    </button>
                                    <button
                                        onClick={() => handleStopTimer(currentTimer)}
                                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                                    >
                                        정지
                                    </button>
                                </>
                            )}
                            {!currentTimer.running && (
                                <button
                                    onClick={() => handleDeleteTimer(currentTimer)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-gray-200 p-4 w-full md:w-1/3 flex flex-col items-center rounded-lg h-full">
                <FaBell className="text-4xl mb-2" />
                <h2 className="text-2xl font-semibold mb-4">알람</h2>
                <p className="text-gray-500">알람 기능은 곧 추가됩니다.</p>
            </div>
        </div>
    );
};

export default GroupTimerComponent;
