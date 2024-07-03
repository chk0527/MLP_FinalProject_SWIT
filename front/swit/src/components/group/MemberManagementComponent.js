import React, { useEffect, useState } from "react";
import { fetchGroupMembers, expelMember } from "../../api/GroupApi";

const MemberManagementComponent = ({ studyNo }) => {
  const [members, setMembers] = useState([]);

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
      alert(`"${userNick}"님을 추방했습니다.`);
    } catch (error) {
      console.error("Failed to expel member:", error);
      alert("추방에 실패했습니다.");
    }
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
                    onClick={() => handleExpel(member.userId, member.userNick)}
                  >
                    추방
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberManagementComponent;
