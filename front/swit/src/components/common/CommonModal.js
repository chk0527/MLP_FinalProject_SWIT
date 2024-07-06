import { useNavigate } from "react-router-dom";

const CommonModal = ({ modalMessage, callbackFn, navigateFn, closeMessage }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    if (navigateFn) {
      navigateFn();
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="fixed top-0 left-0 z-[1055] flex h-full w-full justify-center items-center bg-black bg-opacity-50"
      onClick={() => {
        if (callbackFn) {
          callbackFn();
        }
      }}
    >
      <div
        className="bg-white shadow-lg rounded-lg p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          <div className="text-yellow-600 text-3xl font-semibold mb-10">
            {modalMessage}
          </div>

          <div className="flex justify-around">
            {navigateFn && (
              <button
                className="rounded bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 text-lg mx-3"
                onClick={handleNavigate}
              >
                확인
              </button>
            )}
           <button
              className={`rounded ${
                navigateFn ? 'bg-gray-400 hover:bg-gray-500' : 'bg-yellow-500 hover:bg-yellow-600'
              } text-white py-2 px-4 text-lg mx-3`}
              onClick={() => {
                if (callbackFn) {
                  callbackFn();
                }
              }}
            >
              {closeMessage || "닫기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
