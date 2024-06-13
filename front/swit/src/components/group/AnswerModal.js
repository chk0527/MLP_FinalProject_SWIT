import React from 'react';

const AnswerModal = ({ isOpen, onClose, answers }) => {
  if (!isOpen) return null;

  // Assuming answers is an array of answer objects
  const answer = answers[0] || {};

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-lg shadow-lg relative z-10">
        <h2 className="text-2xl font-bold mb-4">User Answers</h2>
        {answer.a1 && (
          <div className="mb-2">
            <strong>Q1: </strong>
            {answer.a1}
          </div>
        )}
        {answer.a2 && (
          <div className="mb-2">
            <strong>Q2: </strong>
            {answer.a2}
          </div>
        )}
        {answer.a3 && (
          <div className="mb-2">
            <strong>Q3: </strong>
            {answer.a3}
          </div>
        )}
        {answer.a4 && (
          <div className="mb-2">
            <strong>Q4: </strong>
            {answer.a4}
          </div>
        )}
        {answer.a5 && (
          <div className="mb-2">
            <strong>Q5: </strong>
            {answer.a5}
          </div>
        )}
        {answer.selfintro && (
          <div className="mb-2">
            <strong>Self Introduction: </strong>
            {answer.selfintro}
          </div>
        )}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AnswerModal;
