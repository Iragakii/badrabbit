import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import SuperHeader from './ProfilleUICPN/SuperHeader';

/**
 * Profile layout shell to show when no wallet is connected.
 */
const ProfilePlaceholder = () => {
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

export default ProfilePlaceholder;

