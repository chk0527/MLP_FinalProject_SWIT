import React from 'react';
import Modal from 'react-modal';
import GroupForm from './GroupForm';

const GroupJoinComponent = ({ isModalOpen, closeModal, studyNo }) => {
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Group Join Modal"
            ariaHideApp={false}
            className="fixed inset-0 flex items-center justify-center z-50"
        >
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">스터디 신청</h2>
                <GroupForm studyNo={studyNo} closeModal={closeModal} />
                <button onClick={closeModal} className="mt-4 text-red-500 hover:text-red-700">
                    닫기
                </button>
            </div>
        </Modal>
    );
};

export default GroupJoinComponent;
