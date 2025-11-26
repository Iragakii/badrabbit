import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SuperHeader from './ProfilleUICPN/SuperHeader';
import { useAuth } from '../../../Auth/AuthContext';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import ProfilePlaceholder from './ProfilePlaceholder';

const ProfileUI = () => {
  const { walletaddress } = useParams<{ walletaddress?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { address, isLoggedIn, isLoading } = useAuth();

  const normalizedUrlWallet = walletaddress?.toLowerCase();
  const normalizedUserWallet = address?.toLowerCase();

  const trailingSuffix = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return '';
    const rest = segments.slice(1).join('/');
    return rest ? `/${rest}` : '';
  }, [location.pathname]);

  useEffect(() => {
    if (isLoading || !isLoggedIn || !address) return;

    if (!normalizedUrlWallet || normalizedUrlWallet !== normalizedUserWallet) {
      navigate(`/${address}${trailingSuffix}`, { replace: true });
    }
  }, [
    isLoading,
    isLoggedIn,
    address,
    normalizedUrlWallet,
    normalizedUserWallet,
    navigate,
    trailingSuffix,
  ]);

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn && walletaddress) {
      navigate('/profile', { replace: true });
    }
  }, [isLoading, isLoggedIn, walletaddress, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!walletaddress) {
    if (isLoggedIn && address) {
      return <div>Loading...</div>;
    }
    return <ProfilePlaceholder />;
  }

  const isOwnProfile = isLoggedIn && normalizedUserWallet === normalizedUrlWallet;

  if (!isOwnProfile) {
    return <ProfilePlaceholder />;
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        <NavBar />
        <div>
          <SuperHeader />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProfileUI;

