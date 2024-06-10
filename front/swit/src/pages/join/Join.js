import React from 'react'
import JoinComponent from "../../components/join/JoinComponent"
import BasicLayout from "../../layouts/BasicLayout";

const Join = () => {
    return (
        <BasicLayout>
            <div className="text-2xl font-medium ">
                <div>회원가입</div>
            </div>
            <JoinComponent/>
        </BasicLayout>
        
    )
}
export default Join;