import DescriptionTextTrendingCard from "./TrendingTokenCardDetail.tsx/DescriptionTextTrendingCard"
import TitleTrendingCard from "./TrendingTokenCardDetail.tsx/TitleTrendingCard"
import TrendingCard from "./TrendingTokenCardDetail.tsx/TrendingCard"


const TrendingTokensCardContainer = () => {
  return (
    <>
         <div className="mb-6">
           <TitleTrendingCard />
         </div>
         <div className="mb-4">
           <DescriptionTextTrendingCard />
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mt-6">
          <TrendingCard />
         </div>
    </>
  )
}

export default TrendingTokensCardContainer