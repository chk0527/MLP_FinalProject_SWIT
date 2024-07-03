const ResultModal = ({ callbackFn }) => {
  return (
    <div
      className="fixed top-0 left-0 z-[1055] flex h-full w-full justify-center items-center bg-black bg-opacity-50"
      onClick={() => {
        if (callbackFn) {
          callbackFn();
        }
      }}
    >
      <div className="bg-white shadow-lg rounded-lg p-10">
        <div className="flex flex-col items-center">
          <div className="text-yellow-600 text-3xl font-semibold mb-10">
            게시글 작성이 완료되었습니다.
          </div>
          <button
            className="rounded bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 text-lg"
            onClick={() => {
              if (callbackFn) {
                callbackFn();
              }
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
export default ResultModal;
