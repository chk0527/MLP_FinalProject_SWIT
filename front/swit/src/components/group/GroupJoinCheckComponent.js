import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from "../../util/jwtDecode";
import PendingModal from './PendingModal'; // 모달 컴포넌트 임포트

const GroupJoinCheckComponent = () => {
    const [pendingApplications, setPendingApplications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const userId = getUserIdFromToken();

    useEffect(() => {
        const fetchPendingApplications = async () => {
            try {
                const response = await axios.get(`/api/group/pending_applications`, {
                    params: { userId }
                });
                setPendingApplications(response.data);
            } catch (error) {
                console.error('Error fetching pending applications:', error);
            }
        };

        fetchPendingApplications();
    }, [userId]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {pendingApplications.length > 0 && (
                <button onClick={openModal} className="absolute right-20 top-5 bg-red-400 text-white px-3 rounded hover:bg-red-600 text-lg">
                    !
                </button>
            )}
            <PendingModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                pendingApplications={pendingApplications}
            />
        </>
    );
};

export default GroupJoinCheckComponent;
