// GroupJoinComponent.js
import React from 'react';
import Modal from 'react-modal';
import GroupForm from '../group/GroupForm';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxHeight: '80%',
    overflow: 'auto', // to allow scrolling if content is too long
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)' // darker background
  }
};

const GroupJoinComponent = ({ isModalOpen, closeModal, studyNo }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Group Form"
      ariaHideApp={false}
      style={customStyles}
    >
      <div className="p-4 bg-green-100 rounded-lg">
        <GroupForm studyNo={studyNo} />
        <div className='flex justify-end'>
        <button onClick={closeModal} className="btn btn-secondary mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          닫기
        </button>
        </div>
      </div>
    </Modal>
  );
};

export default GroupJoinComponent;
