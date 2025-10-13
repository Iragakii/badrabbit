import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import SuperHeader from './ProfilleUICPN/SuperHeader';
import { useAuth } from '../../Auth/AuthContext';

const ProfileUI = () => {
  const { walletaddress } = useParams();
  const [loading, setLoading] = useState(true);
  const { address, isLoggedIn } = useAuth();
  const navigate = useNavigate();

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
    <>
      <div className="min-h-screen">
        <div className="flex">
          <div className="z-55">
            <NavBar />
          </div>
          <div className="flex-1 ml-[62px] mt-[50px]">
            <SuperHeader />
            <div className="p-6 space-y-6">
              {/* Profile content */}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUI;