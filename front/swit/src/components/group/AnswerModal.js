import React from 'react';

const AnswerModal = ({ isOpen, onClose, answers, questions }) => {
  if (!isOpen) return null;

  const answer = answers[0] || {};

  const questionAnswerPairs = [
    { question: questions.q1, answer: answer.a1 },
    { question: questions.q2, answer: answer.a2 },
    { question: questions.q3, answer: answer.a3 },
    { question: questions.q4, answer: answer.a4 },
    { question: questions.q5, answer: answer.a5 },
    { question: "한마디", answer: answer.selfintro }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-8 rounded-lg shadow-2xl relative z-10 max-w-lg w-full mx-4">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-900">신청서</h2>
        <div className="space-y-6">
          {questionAnswerPairs.map((pair, index) => (
            pair.question && pair.answer && (
              <div key={index} className="p-4 bg-gray-50 rounded-md">
                <strong className="block text-lg mb-2 text-gray-700">{pair.question}</strong>
                <p className="text-gray-600">{pair.answer}</p>
              </div>
            )
          ))}
        </div>
        <div className="text-center">
          <button
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition duration-300"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerModal;
