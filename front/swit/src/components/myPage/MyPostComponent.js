import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getUserBoardList } from '../../api/BoardApi';
import { getUserInquiries } from '../../api/StudyApi';
import { getUserNoFromToken, getUserIdFromToken } from '../../util/jwtDecode';
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0,
};

const MyPostComponent = () => {
    const [boards, setBoards] = useState(initState); // 사용자가 작성한 게시글 목록
    const [inquiries, setInquiries] = useState(initState); // 사용자가 작성한 문의글 목록
    const [view, setView] = useState('boards'); // 현재 보여주는 뷰
    const [page, setPage] = useState(1); // 페이지 번호
    const [size, setSize] = useState(5); // 페이지 사이즈
    const userNo = getUserNoFromToken(); // 게시글 조회에 필요한 userNo
    const userId = getUserIdFromToken(); // 문의글 조회에 필요한 userId
    const { moveToUserBoardList, moveToUserInquiryList } = useCustomMove({ setPage, setSize });

    useEffect(() => {
        if (view === 'boards' && userNo) {
            fetchBoards();
        } else if (view === 'inquiries' && userId) {
            fetchInquiries();
        }
    }, [userNo, userId, page, size, view]);

    // 사용자가 작성한 게시글 목록 조회
    const fetchBoards = async () => {
        try {
            const boardList = await getUserBoardList(userNo, { page, size });
            // 댓글 갯수를 계산하여 boards에 포함
            const boardsWithCommentCount = boardList.dtoList.map(board => ({
                ...board,
                commentCount: board.comments ? board.comments.length : 0,
                boardCreatedDate: formatDate(new Date(board.boardCreatedDate)) // 날짜 형식 변경
            }));
            setBoards({ ...boardList, dtoList: boardsWithCommentCount });
            console.log("사용자의 게시글 목록:", boardsWithCommentCount);
        } catch (error) {
            console.error("사용자의 게시글 목록 조회 실패: ", error);
        }
    };

    // 사용자가 작성한 문의글 목록 조회
    const fetchInquiries = async () => {
        try {
            const inquiryList = await getUserInquiries(userId, { page, size });

            // 답변 유무를 판단하여 inquiries에 포함
            const inquiriesWithResponse = inquiryList.dtoList.map(inquiry => ({
                ...inquiry,
                responseStatus: inquiry.responseContent != null ? "O" : "X",
                inquiryTime: formatDate(new Date(inquiry.inquiryTime)) // 날짜 형식 변경
            }));
            setInquiries({ ...inquiryList, dtoList: inquiriesWithResponse });
            console.log("사용자의 문의글 목록:", inquiriesWithResponse);
        } catch (error) {
            console.error("사용자의 문의글 목록 조회 실패: ", error);
        }
    };

    // 날짜 형식 변환
    const formatDate = (date) => {
        const dateString = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '-').replace(/ /g, '').slice(0, -1);

        const timeString = date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        return `${dateString} ${timeString}`;
    };

    // 뷰 변경 핸들러
    const handleViewChange = (newView) => {
        setView(newView);
        setPage(1); // 뷰가 변경될 때 페이지를 1로 리셋
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full mb-8">
            <h2 className="text-lg font-bold mb-4">My 작성한 글</h2>
            <div className="flex mb-4">
                <button
                    onClick={() => handleViewChange('boards')}
                    className={`px-4 py-2 rounded ${view === 'boards' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    게시글
                </button>
                <button
                    onClick={() => handleViewChange('inquiries')}
                    className={`ml-2 px-4 py-2 rounded ${view === 'inquiries' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    문의글
                </button>
            </div>

            {view === 'boards' ? (
                <div>
                    {/*작성한 게시글 모음*/}
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
                            {boards.dtoList.length > 0 ? (
                                boards.dtoList.map(board => (
                                    <tr key={board.boardNo}>
                                        <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis" style={{ maxWidth: '150px' }}>
                                            <Link to={`/board/read/${board.boardNo}`} className="text-blue-600 hover:underline">
                                                {board.boardTitle}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{board.boardCreatedDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{board.boardCategory}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{board.commentCount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-center" colSpan="4">작성한 게시글이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <PageComponent serverData={boards} movePage={moveToUserBoardList} />
                </div>
            ) : (
                <div>
                    {/*작성한 문의글 모음*/}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">문의 내용</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일자</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">답변</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {inquiries.dtoList.length > 0 ? (
                                inquiries.dtoList.map(inquiry => (
                                    <tr key={inquiry.inquiryNo}>
                                        <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis" style={{ maxWidth: '150px' }}>
                                            {inquiry.inquiryContent}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{inquiry.inquiryTime}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{inquiry.responseStatus}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-center" colSpan="3">작성한 문의글이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <PageComponent serverData={inquiries} movePage={moveToUserInquiryList} />
                </div>
            )}
        </div>
    );
};

export default MyPostComponent;
