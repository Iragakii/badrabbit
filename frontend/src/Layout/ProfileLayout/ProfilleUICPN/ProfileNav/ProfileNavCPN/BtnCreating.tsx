import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../../../../../Auth/AuthContext";

const BtnCreating = () => {
  const { walletaddress } = useParams();
  const { address, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const section = "creating";
  const isActive = location.pathname === `/${walletaddress}/${section}`;

  // Redirect if logged in but no walletaddress in URL
  if (isLoggedIn && address && !walletaddress) {
    navigate(`/profile/${address}`);
    return null;
  }

  return (
    <div>
      <Link to={`/${walletaddress}/creating`}>
        <button
          className={`${
            isActive
              ? "text-white border-b-2 border-white font-bold pb-1"
              : "text-[#acadae] hover:text-white"
          } text-[14px] cursor-pointer`}
        >
          Create
        </button>
      </Link>
    </div>
  );
};

export default BtnCreating;