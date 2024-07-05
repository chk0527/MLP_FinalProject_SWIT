import React from 'react';

const StudyRemoveButtonComponent = ({ onClick, isLeader}) => {

  if (!isLeader) {
    return null;
  }
  return (
      <button
        className="text-sm rounded text-white py-1 px-2 text-center bg-red-400"
        onClick={onClick}
      >
        삭제
      </button>
  );
};

export default StudyRemoveButtonComponent;
