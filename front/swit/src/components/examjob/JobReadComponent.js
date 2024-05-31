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
        <div>
            {job.jobNo}<br></br>
            {job.jobTitle}<br></br>
            {job.jobUrl}<br></br>
        </div>

    )
  }

  export default ExamReadComponent;

