import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

const MyStudyComponent = () => {

    return (
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
                <h2 className="text-lg font-bold mb-4">My 스터디 (신청현황)</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">스터디 제목</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청일자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">리액트 같이 공부하실 분 모집해요~!</td>
                            <td className="px-6 py-4 whitespace-nowrap">대면</td>
                            <td className="px-6 py-4 whitespace-nowrap">2024-05-16</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    승인 대기중
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">(전공자 환영)이스트부룩 같이할 파티원 구...</td>
                            <td className="px-6 py-4 whitespace-nowrap">비대면</td>
                            <td className="px-6 py-4 whitespace-nowrap">2024-05-15</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    승인 완료
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
    );
};

export default MyStudyComponent;