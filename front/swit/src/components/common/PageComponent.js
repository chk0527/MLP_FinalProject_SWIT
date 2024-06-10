
//PageComponent : 페이징 처리

import React from 'react';

const PageComponent = ({ serverData, movePage }) => {
  return (
    <div className="m-6 flex justify-center items-center">
      {serverData.prev ? (
        <div className="m-2 p-2 cursor-pointer font-bold text-black" onClick={() => movePage({ page: serverData.prevPage })}>
          &lt;
        </div>
      ) : (
        <div className="m-2 p-2 font-bold text-gray-300">&lt;</div>
      )}

      {serverData.pageNumList?.map((pageNum) => (
        <div key={pageNum} className={`m-2 p-2 cursor-pointer text-center text-black ${serverData.current === pageNum? 
          'border-b-2 border-black font-bold': 'font-normal'}`} onClick={() => movePage({ page: pageNum })}>
          {pageNum}
        </div>
      ))}

      {serverData.next ? (
        <div className="m-2 p-2 cursor-pointer font-bold text-black" onClick={() => movePage({ page: serverData.nextPage })}>
          &gt;
        </div>
      ) : (
        <div className="m-2 p-2 font-bold text-gray-300">&gt;</div>
      )}
    </div>
  );
};

export default PageComponent;

// const PageComponent = ({ serverData, movePage }) => {
//     return (
//       <div className="m-6 flex justify-center">
//         {serverData.prev ?
//           <div className="m-2 p-2 w-16 text-center font-bold text-blue-400"
//             onClick={() => movePage({ page: serverData.prevPage })}>
//             Prev</div> : <></>}
//         {serverData.pageNumList?.map(pageNum =>
//           <div key={pageNum}
//             className={`m-2 p-2 w-12 text-center rounded shadow-md text-white
//                 ${serverData.current === pageNum ? 'bg-gray-500' : 'bg-blue-400'}`}
//             onClick={() => movePage({ page: pageNum })}>
//             {pageNum}
//           </div>
//         )}
  
//         {serverData.next ?
//           <div className="m-2 p-2 w-16 text-center font-bold text-blue-400"
//             onClick={() => movePage({ page: serverData.nextPage })}>
//             Next</div> : <></>}
//       </div>
//     )
//   }
//   export default PageComponent;
