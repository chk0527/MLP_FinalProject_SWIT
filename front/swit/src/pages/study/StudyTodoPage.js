import GroupTodoListComponent from "../../components/group/GroupTodoListComponent";
import GroupScheduleComponent from "../../components/group/GroupScheduleComponent";
import { useParams } from "react-router-dom";
import { useState } from "react";
const StudyTodoPage = () => {
  const { studyNo } = useParams();
  const [isTodo, setIsTodo] = useState(false);
  const [isStudyTodo, setIsStudyTodo] = useState(true);
  const handleTodo = () => {
    setIsTodo(true);
    setIsStudyTodo(false);
  };
  const handleStudyTodo = () => {
    setIsStudyTodo(true);
    setIsTodo(false);
  };
  return (
    <div className="rounded flex flex-col font-GSans">
      <div className="flex">
        <p
          onClick={handleStudyTodo}
          className={
            isStudyTodo
              ? "text-xl m-2 cursor-pointer shadow-highlight"
              : "text-xl m-2 cursor-pointer"
          }
        >
          스터디 일정
        </p>
        <p className="text-xl m-2">|</p>
        <p
          onClick={handleTodo}
          className={
            isTodo
              ? "text-xl m-2 cursor-pointer shadow-highlight"
              : "text-xl m-2 cursor-pointer"
          }
        >
          오늘 할 일
        </p>
        
      </div>
      {isStudyTodo ? <GroupScheduleComponent studyNo={studyNo}/> : <></>}
      {isTodo ? <GroupTodoListComponent /> : <></>}
    </div>
  );
};

export default StudyTodoPage;
