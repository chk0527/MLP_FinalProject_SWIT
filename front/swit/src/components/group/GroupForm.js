import React, { useState } from 'react';
import { addGroup } from '../../api/GroupApi';

const GroupForm = ({ studyNo }) => {
    const [userId, setUserId] = useState('');
    const [groupSelfintro, setGroupSelfintro] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const groupData = {
            // userId,
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
            {/* <div>
                <label>User ID:</label>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
            </div> */}
            <div>
                <label>Self Introduction:</label>
                <textarea value={groupSelfintro} onChange={(e) => setGroupSelfintro(e.target.value)} required></textarea>
            </div>
            <button type="submit">Add Group</button>
        </form>
    );
};

export default GroupForm;
