
import BasicMenu from "../components/menus/Header";
import Footer from "../components/menus/Footer";
// import notification from "../img/notification-icon.png"
const BasicLayout = ({children}) => {
    return (
        <>
            {/* <header className="bg-teal-400 p-5">
                <h1 className="text-2xl md:text-4xl">Header</h1>
            </header> */}
            <BasicMenu></BasicMenu>
            <div className=" bg-white w-full flex justify-center flex-col space-y-1 md:flex-row md:space-x-1 md:space-y-0">
                <main className=" relative px-5 pt-80 pb-5 ">{children}</main>
                {/* <aside className="bg-green-300 md:w-1/5 lg:w-1/4 px-5 flex py-5">

                    <h1 className="text-2xl md:text-4xl">Sidebar</h1>
                </aside> */}
            </div>
            {/* <button 
                className="fixed bottom-5 right-5 w-10 h-10 bg-no-repeat bg-center bg-cover" 
                style={{ backgroundImage: `url(${notification})` }}
            ></button> */}
            <Footer></Footer>
        </>
    )
}

export default BasicLayout;