import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchGroupRequests,
  confirmGroupJoin,
  isLeader,
  memberCount,
  getUserAnswers,
} from "../../api/GroupApi";
import { getStudy } from "../../api/StudyApi";
import axios from "axios";
import AnswerModal from "./AnswerModal";

const GroupJoinConfirmComponent = () => {
  const { studyNo } = useParams();
  const [groupRequests, setGroupRequests] = useState([]);
  const [userIsLeader, setUserIsLeader] = useState(false);
  const [maxHeadcount, setMaxHeadcount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [questions, setQuestions] = useState({});

  useEffect(() => {
    const getGroupRequests = async () => {
      try {
        const requests = await fetchGroupRequests(studyNo);
        setGroupRequests(requests);
      } catch (error) {
        console.error("Error fetching group requests:", error);
      }
    };

    const checkLeaderStatus = async () => {
      try {
        const isLeaderStatus = await isLeader(studyNo);
        setUserIsLeader(isLeaderStatus);
      } catch (error) {
        console.error("Error checking leader status:", error);
      }
    };

    const fetchStudyDetails = async () => {
      try {
        const studyDetails = await getStudy(studyNo);
        setMaxHeadcount(studyDetails.studyHeadcount);
      } catch (error) {
        console.error("Error fetching study details:", error);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/questions`, {
          params: { studyNo },
        });
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
    getGroupRequests();
    checkLeaderStatus();
    fetchStudyDetails();
  }, [studyNo]);

  const handleConfirm = async (groupNo, approve) => {
    if (!userIsLeader) {
      alert("승인/거절 권한이 없습니다.");
      return;
    }
    try {
      if (approve) {
        const currentMemberCount = await memberCount(studyNo);
        if (currentMemberCount >= maxHeadcount) {
          alert("최대 인원 수에 도달했습니다");
          return;
        }
      }
      await confirmGroupJoin(groupNo, approve);
      setGroupRequests((prevState) =>
        prevState.filter((request) => request.groupNo !== groupNo)
      );
    } catch (error) {
      console.error("Error confirming group join:", error);
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const userAnswers = await getUserAnswers(userId, studyNo);
      setAnswers(userAnswers);
      setSelectedUser(userId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching user answers:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <p className="text-xl font-semibold mt-8 p-2 text-gray-900">
        가입 신청 내역
      </p>
      <hr className="border-4 border-gray-500 mb-4 w-40" />
      <div className="border border-gray-200 rounded overflow-auto custom-scrollbar h-80">
        {groupRequests.length === 0 ? (
          <p className="text-center mt-36">신청 내역이 없습니다.</p>
        ) : (
          <ul className=" bg-white py-1 px-4">
            {groupRequests.map((request) => (
              <li key={request.groupNo} className="rounded px-4 my-8">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-xl text-gray-800">
                      · {request.userNick}
                    </span>
                    <span> 님이 가입을 희망합니다.</span>
                    
                    <button
                      className="bg-white shadow text-gray-500 px-4 py-2 ml-8 rounded hover:bg-gray-700 hover:text-white transition duration-300"
                      onClick={() => handleUserClick(request.userId)}
                    >
                      가입 신청서
                    </button>
                  </div>
                  <span>-----------------------------------------------</span>
                  <div>
                    <button
                      className="bg-white shadow text-gray-500 px-4 py-2 rounded hover:bg-green-700 hover:text-white transition duration-300"
                      onClick={() => handleConfirm(request.groupNo, true)}
                    >
                      승인
                    </button>
                    <button
                      className="bg-white shadow text-gray-500 px-4 py-2 rounded hover:bg-red-700 hover:text-white transition duration-300"
                      onClick={() => handleConfirm(request.groupNo, false)}
                    >
                      거절
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <AnswerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        answers={answers}
        questions={questions}
      />
    </div>
  );
};

export default GroupJoinConfirmComponent;
