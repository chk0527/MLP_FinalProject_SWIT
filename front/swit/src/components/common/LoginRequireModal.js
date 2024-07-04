// import { useNavigate } from "react-router-dom";
// const LoginRequireModal = ({callbackFn }) => {
//     const navigate = useNavigate();

//     return (
//       <div
//         className="fixed top-0 left-0 z-[1055] flex h-full w-full justify-center items-center bg-black bg-opacity-50"
//         onClick={() => {
//           if (callbackFn) {
//             callbackFn();
//           }
//         }}
//       >
//         <div className="bg-white shadow-lg rounded-lg p-10">
//           <div className="flex flex-col items-center">
//             <div className="text-yellow-600 text-3xl font-semibold mb-10">
//               로그인 후 이용해주세요
//             </div>
//             <button
//               className="rounded bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 text-lg"
//               onClick={() => {
//                 navigate("/login")
//                 // if (callbackFn) {
//                 //   callbackFn();
//                 // }
//               }}
//             >
//               이동
//             </button>
//             <button
//               className="rounded bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 text-lg"
//               onClick={() => {
//                 if (callbackFn) {
//                   callbackFn();
//                 }
//               }}
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };
//   export default LoginRequireModal;
  

import { useNavigate } from "react-router-dom";

const LoginRequireModal = ({ callbackFn }) => {
  const navigate = useNavigate();

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
        {/* 수정시작 */}
        <div className="flex flex-col items-center">
          <div className="text-yellow-600 text-3xl font-semibold mb-10">
            로그인 후 이용해주세요
          </div>

          <div className="flex justify-around">
          <button
            className="rounded bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 text-lg  mx-3"
            onClick={() => {
              navigate("/login");
            }}
          >
            이동
          </button>
          <button
            className="rounded bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 text-lg  mx-3"
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
    </div>
  );
};

export default LoginRequireModal;
