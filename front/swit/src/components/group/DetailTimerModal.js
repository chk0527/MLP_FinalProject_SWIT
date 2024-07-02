import React from "react";

const DetailTimerModal = ({
  userNick,
  isOpen,
  onClose,
  userTimers,
  formatStopWatchAdmin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-8 rounded-lg shadow-2xl relative z-10 max-w-lg w-full mx-4">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-900">
          {userNick}님의 공부시간
        </h2>
        <div className="space-y-6">
          {userTimers.map((stopwatch, idx) => (
            <div
              key={stopwatch.timerNo}
              className="flex justify-between p-4 bg-gray-50 rounded-md"
            >
              <strong className="block text-lg mb-2 text-gray-700">
                {idx + 1}. {stopwatch.name}
              </strong>
              <div className="text-gray-600">
                {formatStopWatchAdmin(stopwatch.time)}
              </div>
            </div>
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

export default DetailTimerModal;
