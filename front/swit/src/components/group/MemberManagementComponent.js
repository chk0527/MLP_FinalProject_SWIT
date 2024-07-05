import React, { useEffect, useState } from "react";
import { fetchGroupMembers, expelMember } from "../../api/GroupApi";
import CommonModal from "../common/CommonModal";

const MemberManagementComponent = ({ studyNo }) => {
  const [members, setMembers] = useState([]);
  const [showExpelModal, setShowExpelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const membersData = await fetchGroupMembers(studyNo);
      setMembers(membersData);
    };

    fetchData();
  }, [studyNo]);

  const handleExpel = async (userId, userNick) => {
    try {
      await expelMember(userId, studyNo);
      setMembers(members.map(member =>
        member.userId === userId ? { ...member, groupJoin: 3 } : member
      ));
      setShowExpelModal(false);
      setShowConfirmModal(true);
    } catch (error) {
      console.error("Failed to expel member:", error);
      setShowExpelModal(false);
      alert("추방에 실패했습니다.");
    }
  };

  const confirmExpel = (member) => {
    setSelectedMember(member);
    setShowExpelModal(true);
  };

  return (
    <div className="">
      <p className="text-xl font-semibold mt-8 p-2 text-gray-900"> 회원 관리</p>
      <hr className="border-4 border-gray-500 mb-4 w-40" />
      <table className="w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 border-b">닉네임</th>
            <th className="py-2 border-b">이메일</th>
            <th className="py-2 border-b">가입일</th>
            <th className="py-2 border-b">구분</th>
            <th className="py-2 border-b">추방</th>
          </tr>
        </thead>
        <tbody>
          {members.filter(member => member.groupJoin !== 0 && member.groupJoin !== 3).map((member, index) => (
            <tr key={index}>
              <td className="py-2 border-b text-center">{member.userNick}</td>
              <td className="py-2 border-b text-center">{member.userEmail}</td>
              <td className="py-2 border-b text-center">{new Date(member.userCreateDate).toLocaleDateString()}</td>
              <td className="py-2 border-b text-center">{member.groupLeader === 1 ? '스터디장' : '스터디원'}</td>
              <td className="py-2 border-b text-center">
                {member.groupLeader !== 1 && (
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => confirmExpel(member)}
                  >
                    추방
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

   
      {showExpelModal && selectedMember && (
        <CommonModal
          modalMessage={`"${selectedMember.userNick}" 님을 추방하시겠습니까?`}
          callbackFn={() => setShowExpelModal(false)}
          closeMessage="취소"
          navigateFn={() => handleExpel(selectedMember.userId, selectedMember.userNick)}
          navigateMessage="추방"
        />
      )}

  
      {showConfirmModal && selectedMember && (
        <CommonModal
          modalMessage={`"${selectedMember.userNick}" 님이 추방되었습니다.`}
          callbackFn={() => setShowConfirmModal(false)}
          closeMessage="확인"
        />
      )}
    </div>
  );
};

export default MemberManagementComponent;
