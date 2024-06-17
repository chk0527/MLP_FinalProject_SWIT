import { useState } from "react"
import { useEffect } from "react"
import { getJobRead } from "../../api/ExamJobApi"
import useCustomMove from "../../hooks/useCustomMove"
import { FaStar, FaRegStar } from 'react-icons/fa';

const initState = {
    jobNo: 0,
    jobTitle: "",
    jobCompany: "",
    jobField: "",
    jobLoc: "",
    jobDeadline: null,
    jobActive: 1,
    jobExperience: "",
    jobType: "",
    jobUrl: "",
}

const ExamReadComponent = ({ jobNo }) => {
    const [job, setJob] = useState(initState)

    useEffect(() => {
        getJobRead(jobNo).then(data => {
            console.log(data)
            setJob(data)
        })
    }, [jobNo])


    return (
        <div className="flex justify-center font-GSans">
            <div className="p-6 rounded-lg w-full max-w-6xl">
                <div className="flex justify-center border-soild border-gray-400 border-b-4">
                    <h1 className="text-3xl font-bold mb-5">{job.jobTitle}</h1>
                    <FaRegStar size={35} color="#FFF06B" className="ml-3" />
                </div>

                <div className="flex-wrap w-1000 font-GSans bg-white p-6 border border-white rounded-lg mb-5">
                    <h2 className="text-lg mb-2 font-semibold ml-4">{job.jobCompany}</h2>

                    <div className="flex justify-between mt-4">
                    {/* <h3 className="text-lg font-semibold mb-2">{job.jobTitle}</h3> */}
                    <p className="mb-1 ml-4">접수 마감일: {job.jobDeadline}</p>
                    {/* <p className="mb-3">{job.jobField}</p> */}
                    <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mr-4">입사지원 바로가기</a>
                    </div>
                    <table className="flex-wrap w-full font-GSans text-center border-collapse border border-gray-100 rounded-lg mt-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 p-5">경력조건</th>
                            <th className="border border-gray-200 p-2">고용형태</th>
                            <th className="border border-gray-200 p-2">모집직종</th>
                            <th className="border border-gray-200 p-2">근무예정지</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-200 p-2 py-10 ">{job.jobExperience}</td>
                            <td className="border border-gray-200 p-2">{job.jobType}</td>
                            <td className="border border-gray-200 p-2">{job.jobField}</td>
                            <td className="border border-gray-200 p-2">{job.jobLoc}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
                {/* <table className="flex-wrap w-1300 font-GSans text-center border-collapse border border-gray-100 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 p-5">경력조건</th>
                            <th className="border border-gray-200 p-2">고용형태</th>
                            <th className="border border-gray-200 p-2">모집직종</th>
                            <th className="border border-gray-200 p-2">근무예정지</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-200 p-2 py-10 ">{job.jobExperience}</td>
                            <td className="border border-gray-200 p-2">{job.jobType}</td>
                            <td className="border border-gray-200 p-2">{job.jobField}</td>
                            <td className="border border-gray-200 p-2">{job.jobLoc}</td>
                        </tr>
                    </tbody>
                </table> */}
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

