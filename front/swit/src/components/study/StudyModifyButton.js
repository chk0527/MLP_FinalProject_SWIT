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
    
    <button
        onClick={handleEditClick}
        className="text-sm rounded text-white py-1 px-2 text-center bg-blue-400"
    >
        수정
    </button>
    
    );
};

export default StudyModifyButtonComponent;
