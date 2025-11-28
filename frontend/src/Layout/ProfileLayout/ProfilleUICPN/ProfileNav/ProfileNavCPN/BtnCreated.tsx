import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../../../../../Auth/AuthContext";
import { getApiUrl } from "../../../../../config/api";


const BtnCreated = () => {
  const { walletaddress } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { address, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const section = "created";
  const isActive = location.pathname === `/${walletaddress}/${section}`;

  useEffect(() => {
    // Redirect to wallet address if logged in but no wallet address in URL
    if (isLoggedIn && address && !walletaddress) {
      navigate(`/profile/${address}`);
      return;
    }

    // Fetch profile data
    if (walletaddress) {
      fetch(getApiUrl(`api/user/${walletaddress}`), {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Request failed with status code ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Profile data:", data);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          console.error("Profile fetch error:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [walletaddress, address, isLoggedIn, navigate]);

  // Don't show loading/error in the button itself
  return (
    <div>
      <Link to={`/${walletaddress}/created`}>
        <button
          className={`${
            isActive
              ? "text-white border-b-2 border-white font-bold pb-1"
              : "text-[#acadae] hover:text-white"
          } text-[14px] cursor-pointer`}
        >
          Created
        </button>
      </Link>
    </div>
  );
};

export default BtnCreated;