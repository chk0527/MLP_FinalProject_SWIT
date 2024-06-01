import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BasicLayout from '../../layouts/BasicLayout';

const StudyListPage = () => {
    const navigate = useNavigate();

    const handleReadStudy = (studyNo) => {
        navigate(`/study/read/${studyNo}`);
    };
    const handleAddStudy = () => {
      navigate(`/study/add`);
  };

    return (
        <BasicLayout>
            <div>
                <h1>Study List</h1>
                <button 
    onClick={() => handleReadStudy(2)} 
    
    style={{ 
        padding: '10px', 
        margin: '5px', 
        fontSize: '16px', 
        backgroundColor: 'blue', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer' 
    }}
>
    Go to StudyReadPage
</button>
<br></br>
<Outlet/>
<button 
    onClick={() => handleAddStudy()} 
    style={{ 
        padding: '10px', 
        margin: '5px', 
        fontSize: '16px', 
        backgroundColor: 'green', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer' 
    }}
>
    Go to StudyAddPage
</button>

            </div>
        </BasicLayout>
    );
};

export default StudyListPage;
