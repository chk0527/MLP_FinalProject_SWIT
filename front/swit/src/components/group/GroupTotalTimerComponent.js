import React, { useEffect, useState, useRef } from "react";
import { fetchGroupMembers, expelMember } from "../../api/GroupApi";
import { useNavigate } from "react-router-dom"; // useNavigate가 올바르게 import되었는지 확인하세요
import { FaBookReader } from "react-icons/fa"; // FaBookReader 아이콘이 import되었는지 확인하세요

const GroupTotalTimerComponent = ({ studyNo }) => {
  return (
    <div className="w-1000">
      <p className="text-xl font-semibold mt-8 p-2 text-gray-900">
        회원별 공부 시간
      </p>
      <hr className="border-4 border-gray-500 mb-4 w-1/6" />
      {/* 방장 전용 전체 기록 */}
    </div>
  );
};

export default GroupTotalTimerComponent;
