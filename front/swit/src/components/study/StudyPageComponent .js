
//PageComponent : 페이징 처리

const StudyPageComponent = ({ serverData, movePage }) => {
    return (
      <div className="m-6 flex justify-center">
        {serverData.prev ?
          <div className="m-2 p-2 w-16 cursor-pointer text-center font-bold text-blue-400"
            onClick={() => movePage({ StudyPage: serverData.prevPage })}>
            &lt;</div> : <></>}
            
        {serverData.pageNumList?.map(pageNum =>
          <div key={pageNum}
            className={`m-1 p-2 w-8 cursor-pointer text-center rounded text-black font-bold
                ${serverData.current === pageNum ? 'border-inherit border-2' : ''}`}
            onClick={() => movePage({ StudyPage: pageNum })}>
            {pageNum}
          </div>
        )}
  
        {serverData.next ?
          <div className="m-2 p-2 w-16 cursor-pointer text-center font-bold text-blue-400"
            onClick={() => movePage({ StudyPage: serverData.nextPage })}>
            &gt;</div> : <></>}
      </div>
    )
  }
  export default StudyPageComponent;
