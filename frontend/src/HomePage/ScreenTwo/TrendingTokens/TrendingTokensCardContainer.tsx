import DescriptionTextTrendingCard from "./TrendingTokenCardDetail.tsx/DescriptionTextTrendingCard"
import TitleTrendingCard from "./TrendingTokenCardDetail.tsx/TitleTrendingCard"
import TrendingCard from "./TrendingTokenCardDetail.tsx/TrendingCard"


const TrendingTokensCardContainer = () => {
  return (
    <>
         <TitleTrendingCard />
         <DescriptionTextTrendingCard />
         <div className="flex w-6xl flex-wrap">
          <TrendingCard />
         </div>
    </>
  )
}

export default TrendingTokensCardContainer