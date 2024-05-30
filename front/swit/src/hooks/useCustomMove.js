import { useNavigate } from "react-router-dom";

const useCustomMove = () => {
    const navigate = useNavigate()

    const moveToRead = (num) => {
        navigate({ pathname: `../read/${num}`}) //조회시에 기존의 쿼리문자열을 유지하기 위해

    }
    return  {moveToRead}
}

export default useCustomMove;