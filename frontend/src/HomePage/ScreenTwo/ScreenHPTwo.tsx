import Footer from "../../components/Footer/Footer"
import Header from "../../components/Header/Header"
import NavBar from "../../components/NavBar/NavBar"
import TrendingTokensCardContainer from "./TrendingTokens/TrendingTokensCardContainer"

const SceenHPTwo = () => {
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
            <Header />
            <div className="p-6 space-y-6">
              <TrendingTokensCardContainer />
            
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

export default SceenHPTwo