import GroupTimerComponent from "../../components/group/GroupTimerComponent";
import { useParams } from "react-router-dom";
import { useState } from "react";
const StudyTimerPage = () => {
  const { studyNo } = useParams();
  const [isTimer, setIsTimer] = useState(false);
  const [isStopWatch, setIsStopWatch] = useState(true);
  const handleTimer = () => {
    setIsTimer(true);
    setIsStopWatch(false);
  };
  const handleStopWatch = () => {
    setIsStopWatch(true);
    setIsTimer(false);
  };
  return (
    <div className="rounded flex flex-col font-GSans">
      <div className="flex">
        <p onClick={handleStopWatch} className={isStopWatch ? "text-xl m-2 cursor-pointer text-yellow-700" : "text-xl m-2 cursor-pointer"}>
          스톱워치
        </p>
        <p className="text-xl m-2">|</p>
        <p onClick={handleTimer} className={isTimer ? "text-xl m-2 cursor-pointer text-yellow-700" : "text-xl m-2 cursor-pointer"}>
          타이머
        </p>
      </div>
      {isStopWatch ? <GroupTimerComponent studyNo={studyNo} /> : <></>}
      {isTimer ? <GroupTimerComponent studyNo={studyNo} /> : <></>}
    </div>
  );
};

export default StudyTimerPage;
