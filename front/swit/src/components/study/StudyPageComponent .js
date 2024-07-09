
//PageComponent : 페이징 처리

const StudyPageComponent = ({ serverData, movePage }) => {
    return (
      <div className="m-6 flex justify-center items-center">
        {serverData.prev ?
          <div className="m-2 p-2 cursor-pointer font-bold text-black"
            onClick={() => movePage({ StudyPage: serverData.prevPage })}>
            &lt;</div> : <div className="m-2 p-2 font-bold text-gray-300">&lt;</div>}
            
        {serverData.pageNumList?.map(pageNum =>
          <div key={pageNum}
            className={`m-2 p-2 cursor-pointer text-center text-black
                ${serverData.current === pageNum ? 'border-b-2 border-black font-bold': 'font-normal'}`}
            onClick={() => movePage({ StudyPage: pageNum })}>
            {pageNum}
          </div>
        )}
  
        {serverData.next ?
          <div className="m-2 p-2 cursor-pointer font-bold text-black"
            onClick={() => movePage({ StudyPage: serverData.nextPage })}>
            &gt;</div> : <div className="m-2 p-2 font-bold text-gray-300">&gt;</div>}
      </div>
    )
  }
  export default StudyPageComponent;
