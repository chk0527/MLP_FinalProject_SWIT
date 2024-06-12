import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { fetchGroupRequests, confirmGroupJoin } from '../../api/GroupApi';

const GroupJoinConfirmComponent = () => {
  const { studyNo } = useParams(); // URL 파라미터에서 studyNo를 가져옴
  const [groupRequests, setGroupRequests] = useState([]);

  useEffect(() => {
      const getGroupRequests = async () => {
          try {
              const requests = await fetchGroupRequests(studyNo);
              setGroupRequests(requests);
          } catch (error) {
              console.error('Error fetching group requests:', error);
          }
      };

      getGroupRequests();
  }, [studyNo]);

  const handleConfirm = async (groupNo, approve) => {
      try {
          await confirmGroupJoin(groupNo, approve);
          setGroupRequests(prevState => prevState.filter(request => request.groupNo !== groupNo));
      } catch (error) {
          console.error('Error confirming group join:', error);
      }
  };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">신청 내역 - {studyNo}번 스터디</h2>
            {groupRequests.length === 0 ? (
                <p className="text-center text-gray-600">No join requests</p>
            ) : (
                <ul className="space-y-4">
                    {groupRequests.map(request => (
                        <li key={request.groupNo} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">닉네임: {request.userNick}</p>
                                    <p className="text-gray-600 mt-1">한마디: {request.groupSelfintro}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                        onClick={() => handleConfirm(request.groupNo, true)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                        onClick={() => handleConfirm(request.groupNo, false)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GroupJoinConfirmComponent;
