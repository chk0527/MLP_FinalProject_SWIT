import React from 'react';

const BoardDeleteModal = ({ content, callbackFn, cancelFn }) => {
  return (
    <div
      className="fixed top-0 left-0 z-[1055] flex h-full w-full justify-center items-center bg-black bg-opacity-50"
      onClick={cancelFn}
    >
      <div
        className="bg-white shadow-lg rounded-lg p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          <div className="text-yellow-600 text-3xl font-semibold mb-10">
            정말 {content} 하시겠습니까?
          </div>
          <div className="flex gap-4">
            <button
              className="rounded bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 text-lg"
              onClick={callbackFn}
            >
              확인
            </button>
            <button
              className="rounded bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 text-lg"
              onClick={cancelFn}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDeleteModal;
