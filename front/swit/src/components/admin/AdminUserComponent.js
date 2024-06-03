// import { useState, useEffect } from 'react';
// //import DatePicker from 'react-datepicker';
// import PageComponent from '../common/PageComponent';
// import { API_SERVER_HOST, getUserList } from '../../api/adminApi';

// const initState = {
//   dtoList: [],
//   pageNumList: [],
//   pageRequestDTO: null,
//   prev: false,
//   next: false,
//   totalCount: 0,
//   prevPage: 0,
//   nextPage: 0,
//   totalPage: 0,
//   current: 0
// };

// const AdminUserComponent = () => {
//   const { page, size, moveToList, moveToRead } = useCustomMove()
//   const [serverData, setServerData] = useState(initState)

//   useEffect(() => {
//     getList({ page, size }).then(data => {
//         console.log(data)
//         setServerData(data)
//     })
// }, [page, size])

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">회원 관리</h1>
//       <div className="flex items-center mb-4">
//         <select 
//           className="border p-2 mr-2" 
//           value={searchType} 
//           onChange={(e) => setSearchType(e.target.value)}
//         >
//           <option value="user_id">아이디</option>
//           <option value="user_name">회원명</option>
//           <option value="user_nick">닉네임</option>
//           <option value="user_email">이메일</option>
//         </select>
//         <input
//           className="border p-2 flex-grow mr-2"
//           type="text"
//           placeholder="검색어"
//           value={searchKeyword}
//           onChange={(e) => setSearchKeyword(e.target.value)}
//         />
//         <DatePicker
//           className="border p-2 mr-2"
//           selected={startDate}
//           onChange={date => setStartDate(date)}
//         />
//         <DatePicker
//           className="border p-2 mr-2"
//           selected={endDate}
//           onChange={date => setEndDate(date)}
//         />
//         <button 
//           className="bg-green-500 text-white p-2 rounded" 
//           onClick={handleSearch}
//         >
//           조회
//         </button>
//       </div>
//       <div className="flex items-center mb-4">
//         <button 
//           className="bg-red-500 text-white p-2 rounded" 
//           onClick={handleDelete}
//         >
//           삭제
//         </button>
//       </div>
//       <table className="table-auto w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">
//               <input 
//                 type="checkbox" 
//                 checked={selectAll} 
//                 onChange={handleSelectAll}
//               />
//             </th>
//             <th className="border p-2">아이디(이메일 주소)</th>
//             <th className="border p-2">회원명</th>
//             <th className="border p-2">닉네임</th>
//             <th className="border p-2">전화번호</th>
//             <th className="border p-2">가입일자</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(user => (
//             <tr key={user.user_id}>
//               <td className="border p-2">
//                 <input
//                   type="checkbox"
//                   checked={selectedIds.includes(user.user_id)}
//                   onChange={() => handleSelect(user.user_id)}
//                 />
//               </td>
//               <td className="border p-2">{user.user_email}</td>
//               <td className="border p-2">{user.user_name}</td>
//               <td className="border p-2">{user.user_nick}</td>
//               <td className="border p-2">{user.user_phone}</td>
//               <td className="border p-2">{new Date(user.user_create_date).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="flex justify-center mt-4">
//         <button 
//           onClick={() => setPage(page - 1)} 
//           disabled={page === 1} 
//           className="border px-4 py-2"
//         >
//           Previous
//         </button>
//         <span className="px-4 py-2">Page {page}</span>
//         <button 
//           onClick={() => setPage(page + 1)} 
//           disabled={users.length < size} 
//           className="border px-4 py-2"
//         >
//           Next
//         </button>
//       </div>
//       <PageComponent serverData={serverData} movePage={setPage} />
//     </div>
//   );
// }

// export default AdminUserComponent;