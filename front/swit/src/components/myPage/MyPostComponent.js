import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

const MyPostComponent = () => {

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
            <h2 className="text-lg font-bold mb-4">My 작성한 글</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">글 제목</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일자</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글 수</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">리액트 같이 공부하실 분 모집해요~!</td>
                        <td className="px-6 py-4 whitespace-nowrap">2024-05-16</td>
                        <td className="px-6 py-4 whitespace-nowrap">12</td>
                        <td className="px-6 py-4 whitespace-nowrap">1</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">(전공자 환영)이스트부룩 같이할 파티원 구...</td>
                        <td className="px-6 py-4 whitespace-nowrap">2024-05-15</td>
                        <td className="px-6 py-4 whitespace-nowrap">5</td>
                        <td className="px-6 py-4 whitespace-nowrap">2</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MyPostComponent;