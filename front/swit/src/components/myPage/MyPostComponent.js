import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getUserBoardList } from '../../api/BoardApi';
import { getUserNoFromToken } from '../../util/jwtDecode';

const MyPostComponent = () => {
    const [boards, setBoards] = useState([]); // 사용자가 작성한 게시글 목록
    const [page, setPage] = useState(1); // 페이지 번호
    const userNo = getUserNoFromToken(); // 게시글 조회에 필요한 userNo

    useEffect(() => {
        if (userNo) {
            fetchBoards();
        } else {
            console.log("userNo를 찾을 수 없습니다.");
        }
    }, [userNo, page]);

    // 사용자가 작성한 글 목록 조회
    const fetchBoards = async () => {
        try {
            const boardList = await getUserBoardList(userNo, page);
            // 댓글 갯수를 계산하여 boards에 포함
            const boardsWithCommentCount = boardList.dtoList.map(board => ({
                ...board,
                commentCount: board.comments ? board.comments.length : 0
            }));
            setBoards(boardsWithCommentCount);
            console.log("사용자가 작성한 글 목록:", boardsWithCommentCount);
        } catch (error) {
            console.error("사용자가 작성한 글 목록 조회 실패: ", error);
        }
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
            <h2 className="text-lg font-bold mb-4">My 작성한 글</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">글 제목</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일자</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글 수</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {boards.length > 0 ? (
                        boards.map(board => (
                            <tr key={board.boardNo}>
                                <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis" style={{ maxWidth: '150px' }}>
                                    <Link to={`/board/read/${board.boardNo}`} className="text-blue-600 hover:underline">
                                        {board.boardTitle}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{board.boardCreatedDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{board.boardCategory}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{board.comments.length}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-center" colSpan="4">작성한 게시글이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* 페이지네이션 버튼 */}
            <div className="flex justify-center mt-4">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50">이전</button>
                <button onClick={() => handlePageChange(page + 1)} className="px-3 py-1 mx-1 bg-gray-300 rounded">다음</button>
            </div>
        </div>
    );
};

export default MyPostComponent;
