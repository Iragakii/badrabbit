

import Footer from "../components/Footer/Footer"
import Header from "../components/Header/Header"
import NavBar from "../components/NavBar/NavBar"
import ScreenHPTwo from "./ScreenTwo/ScreenHPTwo"
const HomePage = () => {
  return (
    <> 
   <div className=" min-h-screen">
  
      <div className="flex">
          {/* Fixed NavBar */}
          <div className="z-55">
            <NavBar />
          </div>

          {/* Main content */}
          <div className="flex-1 ml-[62px] mt-[50px]"> {/* Adjust margin based on navbar width */}
            <div className="fixed top-0 left-0 right-0">
              <Header />
            </div>
            <div className="p-6 space-y-6">
              <ScreenHPTwo></ScreenHPTwo>
            </div>
            <Footer />
          </div>
        </div>
   </div>
    </>
   
  )
}

export default HomePage