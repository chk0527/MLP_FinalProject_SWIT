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
    examDocRegEnd: null,
    examPracStart: null,
    examPracEnd: null,
    examPracRegStart: null,
    examPracRegEnd:null,
    examDocPass:null,
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
            <div className="flex justify-center">
            <div className="p-6 rounded-lg w-full max-w-6xl"> 
                
                    <h1 className="text-xl font-bold mb-5">시험 정보</h1>
               
                <div className="bg-white p-6 border border-gray-300 rounded-lg mb-5">
                    <h1 className="text-lg font-bold mb-2">{exam.examTitle}</h1>
                    <p className="mb-1">필기시험 : {exam.examDocStart} - {exam.examDocEnd}</p>
                    <p className="mb-3">실기시험 : {exam.examPracStart} - {exam.examPracEnd}</p>
                </div>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-5">필기접수기간</th>
                            <th className="border border-gray-300 p-2">필기시험</th>
                            <th className="border border-gray-300 p-2">필기 합격발표</th>
                            <th className="border border-gray-300 p-2">실기접수기간</th>
                            <th className="border border-gray-300 p-2">실기시험</th>
                            <th className="border border-gray-300 p-2">실기 합격발표</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 p-2 py-10">{exam.examDocRegStart}-{exam.examDocRegEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examDocEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examDocPass}</td>
                            <td className="border border-gray-300 p-2">{exam.examPracRegStart}-{exam.examPracRegEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examPracStart}-{exam.examPracEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examPracEnd}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
    
        

    )
  }

  export default ExamReadComponent;

