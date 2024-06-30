import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudyModifyButtonComponent = ({ studyNo, isLeader }) => {
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/study/modify/${studyNo}`);
    };

    if (!isLeader) {
        return null;
    }

    return (
    <div className='flex justify-center m-32'>
    <button
        onClick={handleEditClick}
        className="bg-gray-500 w-52 h-12 text-white text-center"
    >
        수정
    </button>
    </div>
    );
};

export default StudyModifyButtonComponent;
