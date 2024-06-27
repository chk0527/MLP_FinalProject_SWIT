import { createSearchParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";

const getNum = (param, defaultValue) => {
    if (!param) {
        return defaultValue;
    }
    return parseInt(param)
}

const useCustomMove = () => {
    const navigate = useNavigate()
    const [queryParams] = useSearchParams()
    const page = getNum(queryParams.get('page'), 1)
    const size = getNum(queryParams.get('size'), 10)

    const queryDefault = createSearchParams({ page, size }).toString()

    const moveToExamList = (pageParam) => {
        let queryStr = ""
        if(pageParam){
            const pageNum = getNum(pageParam.page,1)
            const sizeNum = getNum(pageParam.size,10)
            const location ={};
            location.state = 1;
            queryStr = createSearchParams({page:pageNum, size:sizeNum}).toString()
        }else{
            queryStr = queryDefault
        }
        navigate({ pathname: `../list`, search: queryStr })

    }

    const moveToJobList = (pageParam) => {
        let queryStr = ""
        if(pageParam){
            const pageNum = getNum(pageParam.page,1)
            const sizeNum = getNum(pageParam.size,10)
            const location ={};
            location.state = 1;
            queryStr = createSearchParams({ page: pageNum, size: sizeNum }).toString()
        } else {
            queryStr = queryDefault
        }
        navigate({ pathname: `../list`, search: queryStr })

    }

    const moveToExamRead = (examNo) => {
        console.log(queryDefault);
        navigate({ pathname: `../read/${examNo}`, search: queryDefault })
    }

    const moveToJobRead = (jobNo) => {
        navigate({ pathname: `../read/${jobNo}`, search: queryDefault })
    }

    const moveToRead = (num) => {
        navigate({ pathname: `../read/${num}` }) //조회시에 기존의 쿼리문자열을 유지하기 위해
    }

    const moveToGroup = (num) => {
        navigate({ pathname: `../group/${num}` }) //조회시에 기존의 쿼리문자열을 유지하기 위해
    }

    const moveToList = () => {
        navigate({ pathname: `../study` })
    }

    const moveToBoardList = (pageParam) => {
        let queryStr = ""
        if (pageParam) {
            const pageNum = getNum(pageParam.page, 1)
            const sizeNum = getNum(pageParam.size, 10)
            queryStr = createSearchParams({ page: pageNum, size: sizeNum }).toString()
        }
        else {
            queryStr = queryDefault
        }
        navigate({ pathname: `../board`, search: queryStr })

    }

    const moveToBoardRead = (num) => {
        navigate({ pathname: `../board/read/${num}`  ,search: queryDefault }) //조회시에 기존의 쿼리문자열을 유지하기 위해
    }


    return { moveToExamList, page, size, moveToRead, moveToJobList, moveToExamRead, moveToJobRead, moveToGroup, moveToList, moveToBoardList, moveToBoardRead }
}

export default useCustomMove;