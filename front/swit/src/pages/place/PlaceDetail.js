import React from 'react';
import { useParams } from 'react-router-dom'; // React Router에서 useParams 훅을 가져옵니다.
import BasicLayout from '../../layouts/BasicLayout'; // BasicLayout이 있는 경로를 확인하고 맞게 수정합니다.

const PlaceDetail = () => {
    const { place_no } = useParams(); // useParams 훅을 사용하여 URL 파라미터를 가져옵니다.
    return (
        <BasicLayout>
            <div className="text-3xl">
                <div>마이페이지</div>
            </div>
        </BasicLayout>       
    )
}

export default PlaceDetail;
