import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import GroupForm from './GroupForm';
import { isMember } from '../../api/GroupApi';
import { getUserIdFromToken } from '../../util/jwtDecode';
import { PulseLoader } from 'react-spinners';

const GroupJoinComponent = ({ isModalOpen, closeModal, studyNo }) => {
    const [memberStatus, setMemberStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isModalOpen) {
            setMemberStatus(null);
            setIsLoading(true);
            checkMemberStatus();
        }
    }, [isModalOpen]);

    const checkMemberStatus = async () => {
        const userId = getUserIdFromToken();
        if (userId) {
            const status = await isMember(userId, studyNo);
            setMemberStatus(status);
        } else {
            setMemberStatus(-2); // 비회원(로그인 안 한 상태)
        }
        setIsLoading(false);
    };

    const handleStatusCheck = () => {
        switch (memberStatus) {
            case 0:
                alert('승인 대기 중입니다.');
                closeModal();
                return;
            case 1:
                alert('이미 가입된 상태입니다.');
                closeModal();
                return;
            case 2:
                alert('가입이 거절되었습니다.');
                closeModal();
                return;
            case 3:
                alert('추방된 스터디 그룹입니다.');
                closeModal();
                return;
            default:
                break;
        }
    };

    useEffect(() => {
        if (memberStatus !== null && memberStatus !== -1) {
            handleStatusCheck();
        }
    }, [memberStatus]);

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Group Join Modal"
            ariaHideApp={false}
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg max-h-[70vh] overflow-y-auto mt-50">
                <h2 className="text-xl font-bold mb-4">스터디 신청</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <PulseLoader size={20} color={"#F4CE14"} loading={isLoading} />
                    </div>
                ) : (
                    memberStatus === -1 && <GroupForm studyNo={studyNo} closeModal={closeModal} />
                )}
            </div>
        </Modal>
    );
};

export default GroupJoinComponent;
