import { useState } from "react"
import { useEffect } from "react"
import { getExamRead } from "../../api/ExamJobApi"
import useCustomMove from "../../hooks/useCustomMove"

const initState = {
    examNo:0,
    examTitle: "",
    examDesc: "",
    examDocStart: null,
    examDocEnd: null,
    examDocRegStart: null,
    examDogRegEnd: null,
    examPracStart: null,
    examPracEnd: null,
    examPracRegStart: null,
    examPracRegEnd:null,
    examDogPass:null,
    examPracPass:null,
  }

  const ExamReadComponent = ({examNo}) => {
     const [exam, setExam] = useState(initState)

     useEffect(()=>{
         getExamRead(examNo).then(data => {
             console.log(data)
             setExam(data)
        })
     },[examNo])


    return (
        <div>
            {exam.examNo}<br></br>
            {exam.examTitle}<br></br>
            {exam.examDesc}<br></br>
        </div>

    )
  }

  export default ExamReadComponent;

