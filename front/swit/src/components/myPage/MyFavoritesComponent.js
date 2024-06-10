import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

const MyFavoritesComponent = () => {

    const getNaverMapLink = (location) => {
        return `https://map.naver.com/v5/search/${encodeURIComponent(location)}`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
            <h2 className="text-lg font-bold mb-4">My 즐겨찾기(★)</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">나의 장소</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">나의 시험 및 채용정보</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <a
                                href={getNaverMapLink("작심스터디카페 대치사거리점")}
                                target="_blank"             //_blank: 새 탭에서 로드
                                rel="noopener noreferrer"   //접속자의 보안성 향상
                                className="text-blue-500 hover:underline"
                            >
                                작심스터디카페 대치사거리점
                            </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-between">
                                <span>2024년 정기 기사 3회</span>
                                <button className="bg-green-500 text-white px-4 py-2 rounded">위치 보기</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <a
                                href={getNaverMapLink("브리즈스터디카페 장안점")}
                                target="_blank"             //_blank: 새 탭에서 로드
                                rel="noopener noreferrer"   //접속자의 보안성 향상
                                className="text-blue-500 hover:underline"
                            >
                                브리즈스터디카페 장안점
                            </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-between">
                                <span>엘리베터 정규직 개발자 채용</span>
                                <button className="bg-green-500 text-white px-4 py-2 rounded">위치 보기</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MyFavoritesComponent;