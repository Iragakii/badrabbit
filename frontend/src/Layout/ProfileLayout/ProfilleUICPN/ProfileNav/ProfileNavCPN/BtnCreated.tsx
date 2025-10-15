import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom"
import { useAuth } from "../../../../../../Auth/AuthContext";


const BtnCreated = () => {
    const { walletaddress } = useParams();
  const [loading, setLoading] = useState(true);
  const { address, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const section = 'created';
  const isActive = location.pathname === `/${walletaddress}/${section}`;

  useEffect(() => {
    // Redirect to wallet address if logged in but no wallet address in URL
    if (isLoggedIn && address && !walletaddress) {
      navigate(`/profile/${address}`);
      return;
    }

    // Fetch profile data
    if (walletaddress) {
      fetch(`http://localhost:8081/api/user/${walletaddress}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          console.log('Profile data:', data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Profile fetch error:', err);
          setLoading(false);
        });
    }
  }, [walletaddress, address, isLoggedIn, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <Link to={`/${walletaddress}/created`}>
        <button className={`${isActive ? 'text-white border-b-2 border-white font-bold pb-1' : 'text-[#acadae] hover:text-white'} text-[14px] cursor-pointer`}>Created</button>
      </Link>
    </div>
  )
}

export default BtnCreated