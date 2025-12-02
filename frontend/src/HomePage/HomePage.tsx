import Footer from "../components/Footer/Footer"
import Header from "../components/Header/Header"
import NavBar from "../components/NavBar/NavBar"
import TopFilter from "./TopFilter/TopFilter"
import FirstSlideImg from "./FirstSlideImg/FirstSlideImg"
import ScreenOne from "./ScreenOne/ScreenOne"
import HighWeeklySale from "./HighWeeklySale/HighWeeklySale"
import ScreenHPTwo from "./ScreenTwo/ScreenHPTwo"
import TempNewsTrending from "./TempNewsTrending/TempNewsTrending"
import ScreenThree from "./ScreenThree/ScreenThree"

const HomePage = () => {
  return (
    <> 
   <div className="min-h-screen">
      <div className="flex">
          {/* Fixed NavBar */}
          <div className="z-55">
            <NavBar />
          </div>

          {/* Main content */}
          <div className="flex-1 ml-[62px] mt-[50px]"> {/* Adjust margin based on navbar width */}
            <div className="fixed top-0 left-0 right-0 z-50">
              <Header />
            </div>
            <div className="pt-[10px]">
              {/* Top Filter - Under Header */}
              <TopFilter />
              
              {/* First Slide Image - Half Screen */}
              <FirstSlideImg />
              
              {/* Screen One - All Collections */}
              <ScreenOne />
              
              {/* High Weekly Sale - Between ScreenOne and ScreenTwo */}
              <HighWeeklySale />
              
              {/* Screen Two - Trending Tokens */}
              <div className="p-6">
                <ScreenHPTwo />
              </div>
              
              {/* Temp News Trending */}
              <TempNewsTrending />
              
              {/* Screen Three - NFT 101 Learning Slide */}
              <ScreenThree />
              
              {/* Footer */}
              <Footer />
            </div>
          </div>
        </div>
   </div>
    </>
  )
}

export default HomePage