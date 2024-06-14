import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGroupRequests, confirmGroupJoin, isLeader, memberCount, getUserAnswers } from '../../api/GroupApi';
import { getStudy } from '../../api/StudyApi';
import axios from 'axios';
import AnswerModal from './AnswerModal';

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
        console.error('Error fetching group requests:', error);
      }
    };

    const checkLeaderStatus = async () => {
      try {
        const isLeaderStatus = await isLeader(studyNo);
        setUserIsLeader(isLeaderStatus);
      } catch (error) {
        console.error('Error checking leader status:', error);
      }
    };

    const fetchStudyDetails = async () => {
      try {
        const studyDetails = await getStudy(studyNo);
        setMaxHeadcount(studyDetails.studyHeadcount);
      } catch (error) {
        console.error('Error fetching study details:', error);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/questions`, {
          params: { studyNo }
        });
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
    getGroupRequests();
    checkLeaderStatus();
    fetchStudyDetails();
  }, [studyNo]);

  const handleConfirm = async (groupNo, approve) => {
    if (!userIsLeader) {
      alert('승인/거절 권한이 없습니다.');
      return;
    }
    try {
      if (approve) {
        const currentMemberCount = await memberCount(studyNo);
        if (currentMemberCount >= maxHeadcount) {
          alert('최대 인원 수에 도달했습니다');
          return;
        }
      }
      await confirmGroupJoin(groupNo, approve);
      setGroupRequests(prevState => prevState.filter(request => request.groupNo !== groupNo));
    } catch (error) {
      console.error('Error confirming group join:', error);
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const userAnswers = await getUserAnswers(userId, studyNo);
      setAnswers(userAnswers);
      setSelectedUser(userId);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user answers:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-12">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900">신청 내역 - {studyNo}번 스터디</h2>
      {groupRequests.length === 0 ? (
        <p className="text-center text-gray-600">No join requests</p>
      ) : (
        <ul className="space-y-6">
          {groupRequests.map(request => (
            <li key={request.groupNo} className="p-6 bg-gray-100 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    닉네임: {request.userNick}
                  </p>
                </div>
                <div className="flex space-x-3">
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
                    onClick={() => handleUserClick(request.userId)}
                  >
                    신청서
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                    onClick={() => handleConfirm(request.groupNo, true)}
                  >
                    승인
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
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
      <AnswerModal isOpen={isModalOpen} onClose={closeModal} answers={answers} questions={questions} />
    </div>
  );
};

export default GroupJoinConfirmComponent;
