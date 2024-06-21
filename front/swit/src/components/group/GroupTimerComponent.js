import { useState, useEffect, useRef } from 'react';
import { getAllTimers, getUserTimers, addTimer, deleteTimer, updateTimer } from '../../api/TimerApi';
import { FaStopwatch, FaClock, FaBell, FaChevronDown, FaRedo } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken, getUserNickFromToken } from "../../util/jwtDecode"; // JWT 디코딩 유틸리티 함수

const GroupTimerComponent = ({ studyNo }) => {
    const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수
    const [timers, setTimers] = useState([]);   // 타이머 객체 관리
    const [stopwatches, setStopwatches] = useState([]); // 스톱워치 객체 관리
    const [currentTimer, setCurrentTimer] = useState(null); // 현재 타이머 값 관리
    const [currentStopwatch, setCurrentStopwatch] = useState(null); // 현재 스톱워치 값 관리
    const [studyTimeToday, setStudyTimeToday] = useState(0);    // 오늘의 공부 시간
    const [totalStudyTime, setTotalStudyTime] = useState(0);    // 누적 공부 시간
    const [userStudyTimes, setUserStudyTimes] = useState({});   // 유저별 공부 시간
    const intervalTimerIds = useRef({});    // 각 타이머의 인터벌 ID 관리
    const intervalStopWatchIds = useRef({});    // 각 스톱워치의 인터벌 ID 관리
    const [isEditing, setIsEditing] = useState(false); // 제목 입력창 활성화 상태 관리

    // studyNo에 따른 타이머/스톱워치 불러오기
    useEffect(() => {
        const fetchTimers = async () => {
            try {
                const response = await getAllTimers(studyNo)
                //setTimers(response.filter(timer => timer.type === 'timer'))
                setStopwatches(response)

                // 로컬 스토리지에서 복원
                const savedStopwatch = JSON.parse(localStorage.getItem(`currentStopwatch_${studyNo}`))
                const savedTimer = JSON.parse(localStorage.getItem(`currentTimer_${studyNo}`))

                // (스톱워치) 로컬 스토리지의 상태가 DB에 있는지 확인
                if (savedStopwatch) {
                    const fetchedStopwatch = response.find(timer => timer.timerNo === savedStopwatch.timerNo)
                    if (fetchedStopwatch) {
                        setCurrentStopwatch({ ...fetchedStopwatch, time: savedStopwatch.time })
                        setStopwatches(stopwatches => stopwatches.map(t => t.timerNo === fetchedStopwatch.timerNo ? { ...fetchedStopwatch, time: savedStopwatch.time } : t))
                        if (fetchedStopwatch.running) {
                            handleStartStopwatch({ ...fetchedStopwatch, time: savedStopwatch.time })
                        }
                    } else {
                        localStorage.removeItem(`currentStopwatch_${studyNo}`)
                    }
                }

                // (타이머) 로컬 스토리지의 상태가 DB에 있는지 확인
                if (savedTimer) {
                    const fetchedTimer = response.find(timer => timer.timerNo === savedTimer.timerNo)
                    if (fetchedTimer) {
                        setCurrentTimer({ ...fetchedTimer, time: savedTimer.time })
                        setTimers(timers => timers.map(t => t.timerNo === fetchedTimer.timerNo ? { ...fetchedTimer, time: savedTimer.time } : t))
                        if (fetchedTimer.running) {
                            handleStartTimer({ ...fetchedTimer, time: savedTimer.time })
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
            localStorage.setItem(`timers_${studyNo}`, JSON.stringify(timers))
            localStorage.setItem(`stopwatches_${studyNo}`, JSON.stringify(stopwatches))
            if (currentTimer) {
                localStorage.setItem(`currentTimer_${studyNo}`, JSON.stringify(currentTimer))
            }
            if (currentStopwatch) {
                localStorage.setItem(`currentStopwatch_${studyNo}`, JSON.stringify(currentStopwatch))
            }
        }
    }, [timers, stopwatches, currentTimer, currentStopwatch, studyNo])

    // 서버를 끌 때 일시정지 처리
    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        };
    }, [currentTimer, currentStopwatch])

    //
    const handleBeforeUnload = async () => {
        if (currentStopwatch && currentStopwatch.running) {
            const updatedTimer = { ...currentStopwatch, running: false }
            await updateTimer(studyNo, currentStopwatch.timerNo, updatedTimer)
            setCurrentStopwatch(updatedTimer)
            localStorage.setItem(`currentStopwatch_${studyNo}`, JSON.stringify(updatedTimer))
        }

        if (currentTimer && currentTimer.running) {
            const updatedTimer = { ...currentTimer, running: false }
            await updateTimer(studyNo, currentTimer.timerNo, updatedTimer)
            setCurrentTimer(updatedTimer)
            localStorage.setItem(`currentTimer_${studyNo}`, JSON.stringify(updatedTimer))
        }
    }

    // 타이머 시간 계산
    const formatTimerTime = (time) => {
        const hours = String(Math.floor(time / 3600)).padStart(2, '0')
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0')
        const seconds = String(time % 60).padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    }

    // 스톱워치 시간 계산
    const formatStopWatchTime = (time) => {
        const hours = String(Math.floor(time / 3600000)).padStart(2, '0')
        const minutes = String(Math.floor((time % 3600000) / 60000)).padStart(2, '0')
        const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    }

    // 오늘의 공부 시간 계산
    const formatStudyTime = (time) => {
        const hours = String(Math.floor(time / 3600000)).padStart(2, '0')
        const minutes = String(Math.floor((time % 3600000) / 60000)).padStart(2, '0')
        return `${hours}시간:${minutes}분`
    }

    // 누적 공부 시간 계산
    const formatTotalStudyTime = (time) => {
        const hours = String(Math.floor((time % 86400) / 3600)).padStart(2, '0')
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0')
        return `${hours}시간 ${minutes}분`
    }

    // 공부 시간 복원
    useEffect(() => {
        const savedUserStudyTimes = JSON.parse(localStorage.getItem(`userStudyTimes_${studyNo}`))
        if (savedUserStudyTimes) {
            setUserStudyTimes(savedUserStudyTimes)
        }
    }, [studyNo])

    // 공부 시간 업데이트
    useEffect(() => {
        localStorage.setItem(`userStudyTimes_${studyNo}`, JSON.stringify(userStudyTimes))
    }, [userStudyTimes, studyNo])


    // 기록 추가 함수
    const addRecord = (stopwatch) => {
        const updatedStopwatches = stopwatches.map(t => t.timerNo === stopwatch.timerNo ? { ...t, running: false } : t)
        setStopwatches(updatedStopwatches)
        localStorage.setItem(`stopwatches_${studyNo}`, JSON.stringify(updatedStopwatches))
    }


    // ================== "스톱워치" 기능 핸들러 =========================

    // 기록된 스톱워치를 불러오는 함수
    const handleLoadStopwatch = (timerNo) => {
        const selectedStopwatch = stopwatches.find(sw => sw.timerNo === timerNo)
        if (selectedStopwatch) {
            setCurrentStopwatch(selectedStopwatch)
            setIsEditing(false) // 기존 스톱워치 불러오기 시 제목 입력창 비활성화
        }
    }

    // 새로운 타이머(스톱워치) 생성
    const handleCreateTimer = async (isNext = false) => {
        const userId = getUserIdFromToken()
        if (!userId) {
            alert("로그인 후 이용해주세요")
            navigate("/login")
            return
        }
        const newTimer = {
            name: '',
            time: 0,
            running: false,
            elapsedTime: 0
        }
        try {
            // isNext가 true이고 현재 스톱워치가 존재하면
            if (isNext && currentStopwatch) {
                // 현재 스톱워치 기록을 추가
                const updatedStopwatches = stopwatches.map(t => t.timerNo === currentStopwatch.timerNo ? { ...t, running: false } : t)
                setStopwatches(updatedStopwatches)
                localStorage.setItem(`stopwatches_${studyNo}`, JSON.stringify(updatedStopwatches))
                setCurrentStopwatch(null) // 다음 스톱워치 생성을 위해 현재 스톱워치는 초기화
            }
            const res = await addTimer(studyNo, userId, newTimer)
            setStopwatches([...stopwatches, res])
            setCurrentStopwatch(res)
            setIsEditing(true) // 새로운 스톱워치 생성 시 제목 입력창 활성화

            // 각 타이머나 스톱워치가 추가될 때 다른 컴포넌트가 영향을 받지 않도록 함
            //if (type === 'stopwatch') setStopwatches([...stopwatches, res])
            //if (type === 'timer') setTimers([...timers, res])
        } catch (error) {
            console.error('타이머 생성 실패 : ', error)
        }
    }

    // 타이머(스톱워치) 삭제
    const handleDeleteTimer = async (timer) => {
        try {
            clearInterval(timer.type === 'stopwatch' ? intervalStopWatchIds.current[timer.timerNo] : intervalTimerIds.current[timer.timerNo])
            await deleteTimer(studyNo, timer.timerNo)

            setStopwatches(stopwatches.filter(t => t.timerNo !== timer.timerNo))
            if (currentStopwatch && currentStopwatch.timerNo === timer.timerNo) {
                setCurrentStopwatch(null)
                localStorage.removeItem(`currentStopwatch_${studyNo}`)
            }

            // if (timer.type === 'stopwatch') {
            //     setStopwatches(stopwatches.filter(t => t.timerNo !== timer.timerNo))
            //     if (currentStopwatch && currentStopwatch.timerNo === timer.timerNo) {
            //         setCurrentStopwatch(null)
            //         localStorage.removeItem(`currentStopwatch_${studyNo}`)
            //     }
            // }
            // if (timer.type === 'timer') {
            //     setTimers(timers.filter(t => t.timerNo !== timer.timerNo))
            //     if (currentTimer && currentTimer.timerNo === timer.timerNo) {
            //         setCurrentTimer(null)
            //         localStorage.removeItem(`currentTimer_${studyNo}`)
            //     }
            // }
        } catch (error) {
            console.error('타이머 삭제 실패 : ', error)
        }
    }

    const handleNextStopwatch = async (timer) => {
        try {
            // 기존 스톱워치 기록 추가
            const updatedStopwatches = stopwatches.map(t => t.timerNo === timer.timerNo ? { ...t, running: false } : t)
            setStopwatches(updatedStopwatches)
            setCurrentStopwatch(null)
            localStorage.setItem(`stopwatches_${studyNo}`, JSON.stringify(updatedStopwatches))


        } catch (error) {
            console.error('스톱워치 추가 오류 : ', error);
        }
    }

    // 스톱워치 시작
    const handleStartStopwatch = async (timer) => {
        try {
            if (intervalStopWatchIds.current[timer.timerNo]) {
                clearInterval(intervalStopWatchIds.current[timer.timerNo])
            }

            const updatedTimer = { ...timer, running: true, startAt: Date.now() - (timer.time || 0) }
            setStopwatches(stopwatches => stopwatches.map(t => t.timerNo === timer.timerNo ? updatedTimer : t))
            setCurrentStopwatch(updatedTimer)

            const startTime = Date.now() - (timer.time || 0)
            intervalStopWatchIds.current[timer.timerNo] = setInterval(() => {
                const updatedTime = Date.now() - startTime
                setStopwatches(prev => prev.map(t => t.timerNo === timer.timerNo ? { ...t, time: updatedTime } : t))
                setCurrentStopwatch(prev => ({ ...prev, time: updatedTime }))
                localStorage.setItem(`currentStopwatch_${studyNo}`, JSON.stringify({ ...updatedTimer, time: updatedTime }))
            }, 10)

            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('스톱워치 시작 오류 : ', error);
        }
    }


    // 스톱워치 일시정지
    const handlePauseStopwatch = async (timer) => {
        try {
            clearInterval(intervalStopWatchIds.current[timer.timerNo])
            const elapsedTime = Math.floor((Date.now() - timer.startAt) / 1000) // 작동한 시간 계산
            const updatedTimer = {
                ...timer,
                running: false,
                stopAt: new Date().toISOString(),
                time: timer.time + elapsedTime,
                elapsedTime: elapsedTime
            }
            setStopwatches(stopwatches => stopwatches.map(t => t.timerNo === timer.timerNo ? updatedTimer : t))
            setCurrentStopwatch(updatedTimer)
            localStorage.setItem(`currentStopwatch_${studyNo}`, JSON.stringify(updatedTimer)) // 로컬 스토리지에 상태 저장
            // 유저별 공부 시간 업데이트
            const userId = timer.userId
            const updatedUserStudyTimes = {
                ...userStudyTimes,
                [userId]: {
                    today: elapsedTime, //(userStudyTimes[userId]?.today || 0) + elapsedTime,
                    total: elapsedTime  //(userStudyTimes[userId]?.total || 0) + elapsedTime
                }
            }
            setUserStudyTimes(updatedUserStudyTimes)
            localStorage.setItem(`userStudyTimes_${studyNo}`, JSON.stringify(updatedUserStudyTimes))
            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('스톱워치 일시정지 실패 : ', error)
        }
    }

    // 스톱워치 중지(초기화)
    const handleStopStopwatch = async (timer) => {
        try {
            clearInterval(intervalStopWatchIds.current[timer.timerNo])
            const elapsedTime = Math.floor((Date.now() - timer.startTime) / 1000) // 작동한 시간 계산
            const updatedTimer = {
                ...timer,
                running: false,
                time: 0,
                stopAt: new Date().toISOString(),
                elapsedTime: elapsedTime
            }
            setStopwatches(stopwatches => stopwatches.map(t => t.timerNo === timer.timerNo ? updatedTimer : t))
            setCurrentStopwatch(updatedTimer)
            // 여기서 현재 스톱워치 시간을 오늘의 공부 시간과 누적 공부 시간에 추가
            setStudyTimeToday(prev => prev + elapsedTime)
            setTotalStudyTime(prev => prev + elapsedTime)
            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('스톱워치 정지 실패 : ', error)
        }
    }

    // ================== "타이머" 기능 핸들러 =========================

    // 타이머 시작
    const handleStartTimer = async (timer) => {
        try {
            clearInterval(intervalTimerIds.current[timer.timerNo])

            const updatedTimer = { ...timer, running: true, startTime: Date.now() }
            setTimers(timers => timers.map(t => t.timerNo === timer.timerNo ? updatedTimer : t))
            setCurrentTimer(updatedTimer)

            const startTime = Date.now()
            intervalTimerIds.current[timer.timerNo] = setInterval(() => {
                const updatedTime = timer.time - Math.floor((Date.now() - startTime) / 1000)
                if (updatedTime <= 0) {
                    clearInterval(intervalTimerIds.current[timer.timerNo])
                    const finalTimer = { ...updatedTimer, running: false, time: 0, updatedAt: new Date().toISOString() }
                    setTimers(timers => timers.map(t => t.timerNo === timer.timerNo ? finalTimer : t))
                    setCurrentTimer(finalTimer)
                    localStorage.removeItem(`currentTimer_${studyNo}`)
                    updateTimer(studyNo, timer.timerNo, finalTimer)
                } else {
                    setTimers(prev => prev.map(t => t.timerNo === timer.timerNo ? { ...t, time: updatedTime } : t))
                    setCurrentTimer(prev => ({ ...prev, time: updatedTime }))
                    localStorage.setItem(`currentTimer_${studyNo}`, JSON.stringify({ ...timer, time: updatedTime }))
                }
            }, 1000)

            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('타이머 시작 실패 : ', error)
        }
    }

    // 타이머 일시정지
    const handlePauseTimer = async (timer) => {
        try {
            const userId = getUserIdFromToken()
            clearInterval(intervalTimerIds.current[timer.timerNo])
            const elapsedTime = Math.floor((Date.now() - timer.startTime) / 1000) // 작동한 시간 계산
            const updatedTimer = {
                ...timer,
                running: false,
                updatedAt: new Date().toISOString(),
                time: timer.time, // 현재 남은 시간으로 업데이트
                elapsedTime: timer.time - elapsedTime
            }
            setTimers(timers => timers.map(t => t.timerNo === timer.timerNo ? updatedTimer : t))
            setCurrentTimer(updatedTimer)
            localStorage.setItem(`currentTimer_${studyNo}`, JSON.stringify(updatedTimer)) // 로컬 스토리지에 상태 저장

            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('타이머 일시정지 실패 : ', error)
        }
    }

    // 타이머 정지(초기화)
    const handleStopTimer = async (timer) => {
        try {
            clearInterval(intervalTimerIds.current[timer.timerNo])
            const elapsedTime = (Date.now() - timer.startTime) / 1000
            const updatedTimer = {
                ...timer,
                running: false,
                time: 0,
                updatedAt: new Date().toISOString()
            }
            setTimers(timers => timers.map(t => t.timerNo === timer.timerNo ? updatedTimer : t))
            setCurrentTimer(updatedTimer)
            await updateTimer(studyNo, timer.timerNo, updatedTimer)
        } catch (error) {
            console.error('타이머 정지/초기화 실패 : ', error)
        }
    }

    // ==================== 공부 시간 관리 ======================

    // 오늘 공부한 시간 초기화
    const resetStudyTimeToday = () => {
        setStudyTimeToday(0)
    }

    // 누적 공부 시간 초기화
    const resetTotalStudyTime = () => {
        setTotalStudyTime(0)
    }

    return (
        <div className="w-full space-y-4">
            {/* 오늘의 공부 시간 | 누적 공부 시간 */}
            {/* <div className="text-center my-4">
                {Object.entries(userStudyTimes).map(([userId, times]) => (
                    <div key={userId} className="mb-4">
                        <h3 className="text-2xl font-semibold">
                            {getUserNickFromToken(userId)}님의 오늘 공부한 시간: {formatStudyTime(times.today)}
                        </h3>
                        <h3 className="text-2xl font-semibold">
                            {getUserNickFromToken(userId)}님의 누적 공부 시간: {formatTotalStudyTime(times.total)}
                        </h3>
                    </div>
                ))}
            </div> */}

            <div className="flex flex-col md:flex-row justify-between w-full space-y-4 md:space-y-0 md:space-x-4 items-stretch">
                <div className="flex flex-col w-full">
                    {stopwatches.length === 0 && (
                        <div className="bg-yellow-200 p-4 flex flex-col items-center rounded-lg">
                            <FaStopwatch className="text-4xl mb-2" />
                            <h2 className="text-2xl font-semibold mb-4">스톱워치</h2>
                            <button
                                onClick={() => handleCreateTimer(false)}
                                className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
                            >
                                스톱워치 생성
                            </button>
                        </div>
                    )}

                    {currentStopwatch && (
                        <div className="bg-yellow-200 p-4 flex flex-col items-center rounded-lg mb-4">
                            <FaStopwatch className="text-4xl mb-2" />
                            <h2 className="text-2xl font-semibold mb-4">
                                {getUserNickFromToken(currentStopwatch.userId)}님의 스톱워치
                            </h2>
                            <div className="space-y-4 w-full">
                                <input
                                    type="text"
                                    placeholder="제목"
                                    value={currentStopwatch.name}
                                    onChange={(e) => setCurrentStopwatch({ ...currentStopwatch, name: e.target.value })}
                                    disabled={!isEditing || currentStopwatch.running}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <div className="text-3xl font-mono text-center">{formatStopWatchTime(currentStopwatch.time)}</div>
                                <div className="flex justify-center space-x-2">
                                    {!currentStopwatch.running ? (
                                        <button
                                            onClick={() => {
                                                if (!currentStopwatch.name) {
                                                    alert("제목을 입력하세요.")
                                                } else {
                                                    handleStartStopwatch(currentStopwatch)
                                                    setIsEditing(false) // 시작 시 제목 입력창 비활성화
                                                }
                                            }}
                                            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
                                        >
                                            시작
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    handlePauseStopwatch(currentStopwatch)
                                                }}
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
                                        <>
                                            <button
                                                onClick={() => {
                                                    if (!currentStopwatch.name) {
                                                        alert("제목을 입력하세요.")
                                                    } else {
                                                        addRecord(currentStopwatch)
                                                        handleCreateTimer(true)
                                                    }
                                                }}
                                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                                            >
                                                다음
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTimer(currentStopwatch)}
                                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                                            >
                                                삭제
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* 유저의 스톱워치 기록 남기는 곳 */}
                            <div className="w-full border border-gray-400 p-4 rounded-lg bg-yellow-100 mt-4">
                                {stopwatches.filter(sw => !sw.running).map((stopwatch, index) => (
                                    <div key={stopwatch.timerNo} className="flex justify-between items-center mb-2">
                                        <div className="w-1/3 text-center cursor-pointer mr-4" onClick={() => handleLoadStopwatch(stopwatch.timerNo)}>{index + 1}. {stopwatch.name}</div>
                                        <div className="w-1/3 text-center">{formatStopWatchTime(stopwatch.time)}</div>
                                        <button
                                            onClick={() => handleDeleteTimer(stopwatch)}
                                            className="w-1/3 text-center text-red-500 hover:text-red-700"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col w-full">
                    {timers.length === 0 && (
                        <div className="bg-green-200 p-4 flex flex-col items-center rounded-lg">
                            <FaClock className="text-4xl mb-2" />
                            <h2 className="text-2xl font-semibold mb-4">타이머</h2>
                            <button
                                onClick={() => handleCreateTimer('timer')}
                                className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
                            >
                                타이머 생성
                            </button>
                        </div>
                    )}

                    {timers.map((timer) => (
                        <div key={timer.timerNo} className="bg-green-200 p-4 flex flex-col items-center rounded-lg mb-4">
                            <FaClock className="text-4xl mb-2" />
                            <h2 className="text-2xl font-semibold mb-4">{getUserNickFromToken(timer.userId)}님의 타이머</h2>
                            <div className="space-y-4 w-full">
                                <input
                                    type="text"
                                    placeholder="제목"
                                    value={timer.name}
                                    onChange={(e) => setTimers(timers => timers.map(t => t.timerNo === timer.timerNo ? { ...t, name: e.target.value } : t))}
                                    disabled={timer.running}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                {!timer.running ? (
                                    <div className="grid grid-cols-3 gap-2 justify-center">
                                        <label className="flex flex-col items-center">
                                            시
                                            <input
                                                type="number"
                                                value={Math.floor(timer.time / 3600)}
                                                onChange={(e) =>
                                                    setTimers(timers => timers.map(t => t.timerNo === timer.timerNo ? {
                                                        ...t,
                                                        time: e.target.value * 3600 + (timer.time % 3600),
                                                    } : t))
                                                }
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </label>
                                        <label className="flex flex-col items-center">
                                            분
                                            <input
                                                type="number"
                                                value={Math.floor((timer.time % 3600) / 60)}
                                                onChange={(e) =>
                                                    setTimers(timers => timers.map(t => t.timerNo === timer.timerNo ? {
                                                        ...t,
                                                        time: Math.floor(timer.time / 3600) * 3600 + e.target.value * 60 + (timer.time % 60),
                                                    } : t))
                                                }
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </label>
                                        <label className="flex flex-col items-center">
                                            초
                                            <input
                                                type="number"
                                                value={timer.time % 60}
                                                onChange={(e) =>
                                                    setTimers(timers => timers.map(t => t.timerNo === timer.timerNo ? {
                                                        ...t,
                                                        time: Math.floor(timer.time / 3600) * 3600 + Math.floor((timer.time % 3600) / 60) * 60 + parseInt(e.target.value, 10),
                                                    } : t))
                                                }
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="text-3xl font-mono text-center">{formatTimerTime(timer.time)}</div>
                                )}
                                <div className="flex justify-center space-x-2">
                                    {!timer.running ? (
                                        <button
                                            onClick={() => {
                                                if (!timer.name || timer.time < 1) {
                                                    alert("제목과 상세내용을 입력하고 시간은 1초 이상이어야 합니다.")
                                                } else {
                                                    handleStartTimer(timer)
                                                }
                                            }}
                                            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
                                        >
                                            시작
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handlePauseTimer(timer)}
                                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                                            >
                                                일시정지
                                            </button>
                                            <button
                                                onClick={() => handleStopTimer(timer)}
                                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                                            >
                                                정지
                                            </button>
                                        </>
                                    )}
                                    {!timer.running && (
                                        <button
                                            onClick={() => handleDeleteTimer(timer)}
                                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {timers.length >= 1 && (
                        <div className="flex justify-center mt-4">
                            <FaChevronDown
                                className="text-3xl cursor-pointer"
                                onClick={() => handleCreateTimer('timer')}
                            />
                        </div>
                    )}
                </div>
                <div className="bg-gray-200 p-4 w-full flex flex-col items-center rounded-lg h-full">
                    <FaBell className="text-4xl mb-2" />
                    <h2 className="text-2xl font-semibold mb-4">알람</h2>
                    <p className="text-gray-500">알람 기능은 곧 추가됩니다.</p>
                </div>
            </div>
        </div>
    );
};

export default GroupTimerComponent;