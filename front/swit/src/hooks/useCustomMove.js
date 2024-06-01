import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";

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

    //관리자페이지_사용자 리스트 출력할 때 사용
    const moveToList = (pageParam) => {
        let queryStr = ""
        if (pageParam) {
            const pageNum = getNum(pageParam.page, 1)
            const sizeNum = getNum(pageParam.size, 10)
            queryStr = createSearchParams({ page: pageNum, size: sizeNum }).toString()
        }
        else {
            queryStr = queryDefault
        }
        navigate({ pathname: `../list`, search: queryStr })
    }

    const moveToRead = (num) => {
        navigate({ pathname: `../read/${num}`}) //조회시에 기존의 쿼리문자열을 유지하기 위해

    }
    return  {moveToRead, moveToList, page, size}
}

export default useCustomMove;