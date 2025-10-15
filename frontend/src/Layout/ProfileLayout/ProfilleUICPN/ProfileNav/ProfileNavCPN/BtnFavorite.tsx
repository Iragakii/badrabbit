import { Link, useParams, useLocation } from "react-router-dom"

const BtnFavorite = () => {
  const { walletaddress } = useParams();
  const location = useLocation();

  const section = 'favorite';
  const isActive = location.pathname === `/${walletaddress}/${section}`;

  return (
    <div className="">
      <Link to={`/${walletaddress}/favorite`}>
        <button className={`${isActive ? 'text-white border-b-2 border-white font-bold pb-1' : 'text-[#acadae] hover:text-white'} text-[14px] cursor-pointer`}>Favorite</button>
      </Link>
    </div>
  )
}

export default BtnFavorite
