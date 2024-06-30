import React from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

Modal.setAppElement('#root'); // 애플리케이션 루트 엘리먼트를 설정합니다.

const PendingApplicationsModal = ({ isOpen, onRequestClose, pendingApplications }) => {
  const navigate = useNavigate();

  const handleNavigate = (studyNo) => {
    navigate(`/study/group/${studyNo}`);
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Pending Applications"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg border-red-200 border-4">
        <h2 className="text-xl font-bold mb-4">승인 대기중인 신청내역</h2>
        <ul>
          {pendingApplications.map((application) => (
            <li key={application.studyNo} className="mb-2">
              
              <strong>{application.studyTitle}:</strong> {application.pendingCount}건
              <button
                  onClick={() => handleNavigate(application.studyNo)}
                  className="ml-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                >
                  이동
                </button>
              
            </li>
          ))}
        </ul>
        <button onClick={onRequestClose} className="mt-4 bg-red-300 text-white py-2 px-4 rounded hover:bg-red-400">
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default PendingApplicationsModal;
