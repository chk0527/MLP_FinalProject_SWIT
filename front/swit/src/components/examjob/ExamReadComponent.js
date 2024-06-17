import { useState } from "react"
import { useEffect } from "react"
import { getExamRead } from "../../api/ExamJobApi"
import useCustomMove from "../../hooks/useCustomMove"
import { FaStar, FaRegStar } from 'react-icons/fa';

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
            <div className="flex justify-center font-GSans">
            <div className="p-6 rounded-lg w-full max-w-6xl"> 
                
                <div className="flex justify-center border-gray-400 border-b-4">
                    <h1 className="text-3xl font-bold mb-5">{exam.examTitle}</h1>
                    <FaRegStar size={35} color="#FFF06B" className="ml-3"/>
                    </div>
               
                {/* <div className="flex-wrap w-1000 font-GSans bg-white p-6 border border-gray-300 rounded-lg mb-5 mt-6">
                    <h1 className="text-lg font-bold mb-2">{exam.examTitle}</h1>
                    <p className="mb-1">필기시험 : {exam.examDocStart} - {exam.examDocEnd}</p>
                    <p className="mb-3">실기시험 : {exam.examPracStart} - {exam.examPracEnd}</p>
                </div> */}
                <table className="flex-wrap w-1000 font-GSans border-collapse border border-gray-300 mt-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-5">필기접수기간</th>
                            <th className="border border-gray-300 p-2">필기시험</th>
                            <th className="border border-gray-300 p-2">필기 합격발표</th>
                            <th className="border border-gray-300 p-2">실기접수기간</th>
                            <th className="border border-gray-300 p-2">실기시험</th>
                            <th className="border border-gray-300 p-2">실기 합격발표</th>
                        </tr>
                    </thead>
                    <tbody className=" text-center">
                        <tr>
                            <td className="border border-gray-300 p-2 py-10">{exam.examDocRegStart}<br/>~<br/>{exam.examDocRegEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examDocEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examDocPass}</td>
                            <td className="border border-gray-300 p-2">{exam.examPracRegStart}<br/>~<br/>{exam.examPracRegEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examPracStart}<br/>~<br/>{exam.examPracEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examPracEnd}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="flex justify-center">
                <button
          type="button"
          className="rounded p-3 m-2 text-xl w-28 text-white bg-gray-500"
          onClick={() => window.history.back()}
        >
          목록
        </button>
        </div>
            </div>
            </div>
    
        

    )
  }

  export default ExamReadComponent;

