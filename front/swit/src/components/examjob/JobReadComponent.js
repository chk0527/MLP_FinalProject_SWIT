import { useState } from "react"
import { useEffect } from "react"
import { getJobRead } from "../../api/ExamJobApi"
import useCustomMove from "../../hooks/useCustomMove"

const initState = {
    jobNo: 0,
    jobTitle: "",
    jobCompany: "",
    jobField : "",
    jobLoc: "",
    jobDeadline: null,
    jobActive: 1,
    jobExperience:"",
    jobType:"",
    jobUrl:"",
  }

  const ExamReadComponent = ({jobNo}) => {
     const [job, setJob] = useState(initState)

     useEffect(()=>{
         getJobRead(jobNo).then(data => {
             console.log(data)
             setJob(data)
        })
     },[jobNo])


    return (
        <div className="flex justify-center">
        <div className="p-6 rounded-lg w-full max-w-6xl"> 
            
                <h1 className="text-xl font-bold mb-5">채용 정보</h1>
           
            <div className="bg-white p-6 border border-gray-300 rounded-lg mb-5">
                <h2 className="text-lg mb-2">{job.jobCompany}</h2>
                <h3 className="text-lg font-semibold mb-2">{job.jobTitle}</h3>
                <p className="mb-1">접수 마감일: {job.jobDeadline}</p>
                <p className="mb-3">{job.jobField}</p>
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">입사지원 바로가기</a>
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-5">경력조건</th>
                        <th className="border border-gray-300 p-2">고용형태</th>
                        <th className="border border-gray-300 p-2">모집인원</th>
                        <th className="border border-gray-300 p-2">모집직종</th>
                        <th className="border border-gray-300 p-2">근무예정지</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 p-2 py-10">{job.jobExperience}</td>
                        <td className="border border-gray-300 p-2">{job.jobType}</td>
                        <td className="border border-gray-300 p-2"></td>
                        <td className="border border-gray-300 p-2">{job.jobField}</td>
                        <td className="border border-gray-300 p-2">{job.jobLoc}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>

    )
  }

  export default ExamReadComponent;

