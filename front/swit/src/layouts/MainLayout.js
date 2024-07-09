
import MainHeader from "../components/menus/MainHeader";
import Footer from "../components/menus/Footer";

const BasicLayout = ({children}) => {
    return (
        <>
            {/* <header className="bg-teal-400 p-5">
                <h1 className="text-2xl md:text-4xl">Header</h1>
            </header> */}
            <MainHeader></MainHeader>
            <div className="bg-white w-full flex-col">
                <main>{children}</main>
                {/* <aside className="bg-green-300 md:w-1/5 lg:w-1/4 px-5 flex py-5">

                    <h1 className="text-2xl md:text-4xl">Sidebar</h1>
                </aside> */}
            </div>
            <Footer></Footer>
        </>
    )
}

export default BasicLayout;