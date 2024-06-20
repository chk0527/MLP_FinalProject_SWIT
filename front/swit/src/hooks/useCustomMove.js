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
    const size = getNum(queryParams.get('size'), 5)

    const PlacePage = getNum(queryParams.get('PlacePage'), 1)
    const PlaceSize = getNum(queryParams.get('PlaceSize'), 15)

    const queryDefault = createSearchParams({ page, size }).toString()
    const PlaceQueryDefault = createSearchParams({ PlacePage, PlaceSize }).toString()

    const moveToExamList = (pageParam) => {
        let queryStr = ""
        if(pageParam){
            const pageNum = getNum(pageParam.page,1)
            const sizeNum = getNum(pageParam.size,5)
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
            const sizeNum = getNum(pageParam.size,5)
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

    const moveToPlaceList = (pageParam) => {
        let queryStr = ""
        if (pageParam) {
            const pageNum = getNum(pageParam.PlacePage, 1)
            const sizeNum = getNum(pageParam.PlaceSize, 15)
            queryStr = createSearchParams({ PlacePage: pageNum, PlaceSize: sizeNum }).toString()
        } else {
            queryStr = PlaceQueryDefault
        }
        navigate({ pathname: `../list`, search: queryStr })
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
        navigate({ pathname: `..`, search: queryStr })

    }

    const moveToBoardRead = (num) => {
        navigate({ pathname: `../board/read/${num}`  ,search: queryDefault }) //조회시에 기존의 쿼리문자열을 유지하기 위해
    }


    return { moveToExamList, page, size, PlacePage, PlaceSize, moveToRead, moveToJobList, moveToPlaceList, moveToExamRead, moveToJobRead, moveToGroup, moveToList, moveToBoardList, moveToBoardRead }
}

export default useCustomMove;