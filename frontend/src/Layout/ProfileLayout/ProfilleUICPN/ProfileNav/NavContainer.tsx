
import BtnCreated from "./ProfileNavCPN/BtnCreated"
import BtnCreating from "./ProfileNavCPN/BtnCreating"
import BtnFavorite from "./ProfileNavCPN/BtnFavorite"
import BtnGallery from "./ProfileNavCPN/BtnGallery"
import BtnListings from "./ProfileNavCPN/BtnListings"
import BtnNFTs from "./ProfileNavCPN/BtnNFTs"
import BtnOffers from "./ProfileNavCPN/BtnOffers"
import BtnPorfolio from "./ProfileNavCPN/BtnPorfolio"
import BtnTokens from "./ProfileNavCPN/BtnTokens"
import BtnWatchList from "./ProfileNavCPN/BtnWatchList"


const NavContainer = () => {
  return (
    <>
    <div className="flex justify-between">
         <div className="flex container mx-auto gap-7">
            <BtnGallery></BtnGallery>
            <BtnNFTs></BtnNFTs>
            <BtnTokens></BtnTokens>
            <BtnListings></BtnListings>
            <BtnOffers></BtnOffers>
            <BtnPorfolio></BtnPorfolio>
            <BtnCreating></BtnCreating>
            <BtnCreated></BtnCreated>
            <BtnWatchList></BtnWatchList>
            <BtnFavorite></BtnFavorite>
            
         </div>
          
        </div>
        </>
  )
}

export default NavContainer