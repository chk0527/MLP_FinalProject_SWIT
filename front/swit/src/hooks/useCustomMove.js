import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";

const getNum = (param, defaultValue) => {
    if(!param){
        return defaultValue;
    }
    return parseInt(param)
}

const useCustomMove = () => {
    const navigate = useNavigate()
    const [queryParams] = useSearchParams()
    const page = getNum(queryParams.get('page'),1)
    const size = getNum(queryParams.get('size'),5)

    const PlacePage = getNum(queryParams.get('PlacePage'),1)
    const PlaceSize = getNum(queryParams.get('PlaceSize'),16)
    
    const queryDefault = createSearchParams({page,size}).toString()
    const PlaceQueryDefault = createSearchParams({PlacePage,PlaceSize}).toString()

    const moveToExamList = (pageParam) => {
        let queryStr = ""
        if(pageParam){
            const pageNum = getNum(pageParam.page,1)
            const sizeNum = getNum(pageParam.size,5)
            queryStr = createSearchParams({page:pageNum, size:sizeNum}).toString()
        }else{
            queryStr = queryDefault
        }
        navigate({pathname:`../exam`,search:queryStr})

    }

    const moveToJobList = (pageParam) => {
        let queryStr = ""
        if(pageParam){
            const pageNum = getNum(pageParam.page,1)
            const sizeNum = getNum(pageParam.size,5)
            queryStr = createSearchParams({page:pageNum, size:sizeNum}).toString()
        }else{
            queryStr = queryDefault
        }
        navigate({pathname:`../job`,search:queryStr})
    }

    const moveToPlaceList = (pageParam) => {
        let queryStr = ""
        if(pageParam){
            const pageNum = getNum(pageParam.PlacePage,1)
            const sizeNum = getNum(pageParam.PlaceSize,16)
            queryStr = createSearchParams({PlacePage:pageNum, PlaceSize:sizeNum}).toString()
        }else{
            queryStr = PlaceQueryDefault
        }
        navigate({pathname:`../list`,search:queryStr})
    }

    const moveToRead = (num) => {
        navigate({ pathname: `../read/${num}`}) //조회시에 기존의 쿼리문자열을 유지하기 위해

    }
    return {moveToExamList, page, size, PlacePage, PlaceSize, moveToRead, moveToJobList,moveToPlaceList}
}

export default useCustomMove;