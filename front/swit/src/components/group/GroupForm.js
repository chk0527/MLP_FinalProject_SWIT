// GroupForm.js
import React, { useState } from 'react';
import { addGroup } from '../../api/GroupApi';

const GroupForm = ({ studyNo }) => {
    const [userId, setUserId] = useState('');
    const [groupSelfintro, setGroupSelfintro] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const groupData = {
            studyNo: parseInt(studyNo),
            groupSelfintro
        };

        try {
            const response = await addGroup(groupData);
            console.log('Group added successfully:', response);
            alert('Group added successfully');
        } catch (error) {
            console.error('Error adding group:', error);
            alert('Error adding group');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div >
                <p>하고 싶은 말:</p>
                <textarea value={groupSelfintro} onChange={(e) => setGroupSelfintro(e.target.value)} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-4 px-4 py-2 bg-green-500 text-white">제출</button>
        </form>
    );
};

export default GroupForm;
