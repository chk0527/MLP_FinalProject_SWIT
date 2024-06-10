import { useEffect, useState } from "react";
import { getExamAll, getExamList } from "../../api/ExamJobApi"
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const initState = {
    examNo: 0,
    examTitle: "",
    examDesc: "",
    examDocStart: null,
    examDocEnd: null,
    examDocRegStart: null,
    examDocRegEnd: null,
    examPracStart: null,
    examPracEnd: null,
    examPracRegStart: null,
    examPracRegEnd: null,
    examDocPass: null,
    examPracPass: null,
}

const ExamCalenderComponent = () => {

    // const [exam, setExam] = useState(initState)
    // useEffect(() => {
    //     getExamAll().then(data => {
    //         console.log(data)
    //         setExam(data)
    //     })
    // })



    return (
        <div className="calendar">

 
            <FullCalendar
                defaultView="dayGridMonth"
                plugins={[dayGridPlugin]}

            />
        </div>
    )
}

export default ExamCalenderComponent;
