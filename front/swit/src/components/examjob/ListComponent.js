import { Link } from "react-router-dom";

const ListComponent = () => {
    return (
        <div>
            <div className="divide-y divide-slate-100">
                <ul className="divide-y divide-slate-100">

               
                <article className="flex items-start space-x-6 p-6">
                <div>
            <dt className="sr-only">채용/시험</dt>
            <dd className="px-2.5 rounded-full bg-[#A4CEF5]/[0.6] text-white">채용</dd>
          </div>
      {/* <img src={movie.image} alt="" width="60" height="88" className="flex-none rounded-md bg-slate-100" /> */}
      <div className="min-w-0 relative flex-auto">
        <h2 className="font-semibold text-slate-900 truncate pr-20"> <Link to={'/'}>엘씨테크 정규직 개발자 채용</Link></h2> 
        <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
          <div className="absolute top-0 right-0 flex items-center space-x-1">
            <dt className="text-sky-500">
              <span className="sr-only">Star rating</span>
              <svg width="16" height="20" fill="#FFF06B">
                <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
              </svg>
            </dt>
            <dd></dd>
          </div>
          
          <div className="ml-2">
            <dt className="sr-only">회사</dt>
            <dd><Link to={'/'}>(주)엔코아</Link></dd>
          </div>
          <div>
            <dt className="sr-only">직무</dt>
            <dd className="flex items-center">
              <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              <Link to={'/'}>소프트웨어 개발</Link>
            </dd>
          </div>
          <div>
            <dt className="sr-only">접수마감일</dt>
            <dd className="flex items-center">
              <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              <Link to={'/'}>접수 마감일 : ~ 2024-08-24</Link>
            </dd>
          </div>

        </dl>
      </div>
    </article>
   

    <article className="flex items-start space-x-6 p-6">
                <div>
            <dt className="sr-only">Rating</dt>
            <dd className="px-2.5 rounded-full bg-[#A4CEF5]/[0.6] text-white">채용</dd>
          </div>
      {/* <img src={movie.image} alt="" width="60" height="88" className="flex-none rounded-md bg-slate-100" /> */}
      <div className="min-w-0 relative flex-auto">
        <h2 className="font-semibold text-slate-900 truncate pr-20">엘씨테크 정규직 개발자 채용</h2>
        <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
          <div className="absolute top-0 right-0 flex items-center space-x-1">
            <dt className="text-sky-500">
              <span className="sr-only">Star rating</span>
              <svg width="16" height="20" fill="#FFF06B">
                <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
              </svg>
            </dt>
            <dd></dd>
          </div>
          
          <div className="ml-2">
            <dt className="sr-only">회사</dt>
            <dd>(주)엔코아</dd>
          </div>
          <div>
            <dt className="sr-only">직무</dt>
            <dd className="flex items-center">
              <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              소프트웨어 개발
            </dd>
          </div>
          <div>
            <dt className="sr-only">접수마감일</dt>
            <dd className="flex items-center">
              <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              접수 마감일 : ~ 2024-08-24
            </dd>
          </div>

        </dl>
      </div>
    </article>


    <article className="flex items-start space-x-6 p-6">
                <div>
            <dt className="sr-only">Rating</dt>
            <dd className="px-2.5 rounded-full bg-[#A4CEF5]/[0.6] text-white">채용</dd>
          </div>
      {/* <img src={movie.image} alt="" width="60" height="88" className="flex-none rounded-md bg-slate-100" /> */}
      <div className="min-w-0 relative flex-auto">
        <h2 className="font-semibold text-slate-900 truncate pr-20">엘씨테크 정규직 개발자 채용</h2>
        <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
          <div className="absolute top-0 right-0 flex items-center space-x-1">
            <dt className="text-sky-500">
              <span className="sr-only">Star rating</span>
              <svg width="16" height="20" fill="#FFF06B">
                <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
              </svg>
            </dt>
            <dd></dd>
          </div>
          
          <div className="ml-2">
            <dt className="sr-only">회사</dt>
            <dd>(주)엔코아</dd>
          </div>
          <div>
            <dt className="sr-only">직무</dt>
            <dd className="flex items-center">
              <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              소프트웨어 개발
            </dd>
          </div>
          <div>
            <dt className="sr-only">접수마감일</dt>
            <dd className="flex items-center">
              <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              접수 마감일 : ~ 2024-08-24
            </dd>
          </div>

        </dl>
      </div>
    </article>



    <article className="flex items-start space-x-6 p-6">
                <div>
            <dt className="sr-only">Rating</dt>
            <dd className="px-2.5 rounded-full bg-[#A4CEF5]/[0.6] text-white">채용</dd>
          </div>
      {/* <img src={movie.image} alt="" width="60" height="88" className="flex-none rounded-md bg-slate-100" /> */}
      <div className="min-w-0 relative flex-auto">
        <h2 className="font-semibold text-slate-900 truncate pr-20">엘씨테크 정규직 개발자 채용</h2>
        <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
          <div className="absolute top-0 right-0 flex items-center space-x-1">
            <dt className="text-sky-500">
              <span className="sr-only">Star rating</span>
              <svg width="16" height="20" fill="#FFF06B">
                <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
              </svg>
            </dt>
            <dd></dd>
          </div>
          
          <div className="ml-2">
            <dt className="sr-only">회사</dt>
            <dd>(주)엔코아</dd>
          </div>
          <div>
            <dt className="sr-only">직무</dt>
            <dd className="flex items-center">
              <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              소프트웨어 개발
            </dd>
          </div>
          <div>
            <dt className="sr-only">접수마감일</dt>
            <dd className="flex items-center">
              <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              접수 마감일 : ~ 2024-08-24
            </dd>
          </div>

        </dl>
      </div>
    </article>



    <article className="flex items-start space-x-6 p-6">
                <div>
            <dt className="sr-only">Rating</dt>
            <dd className="px-2.5 rounded-full bg-[#A4CEF5]/[0.6] text-white">채용</dd>
          </div>
      {/* <img src={movie.image} alt="" width="60" height="88" className="flex-none rounded-md bg-slate-100" /> */}
      <div className="min-w-0 relative flex-auto">
        <h2 className="font-semibold text-slate-900 truncate pr-20">엘씨테크 정규직 개발자 채용</h2>
        <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
          <div className="absolute top-0 right-0 flex items-center space-x-1">
            <dt className="text-sky-500">
              <span className="sr-only">Star rating</span>
              <svg width="16" height="20" fill="#FFF06B">
                <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
              </svg>
            </dt>
            <dd></dd>
          </div>
          
          <div className="ml-2">
            <dt className="sr-only">회사</dt>
            <dd>(주)엔코아</dd>
          </div>
          <div>
            <dt className="sr-only">직무</dt>
            <dd className="flex items-center">
              <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              소프트웨어 개발
            </dd>
          </div>
          <div>
            <dt className="sr-only">접수마감일</dt>
            <dd className="flex items-center">
              <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              접수 마감일 : ~ 2024-08-24
            </dd>
          </div>

        </dl>
      </div>
    </article>

    

                </ul>
                
            </div>
        </div>
    )
}

export default ListComponent;
