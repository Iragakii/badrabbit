import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import SuperHeader from './ProfilleUICPN/SuperHeader';

/**
 * Profile layout shell to show when no wallet is connected.
 */
const ProfilePlaceholder = () => {
  return (
    <div className="min-h-screen flex">
      <NavBar />
      <div className="flex-1 flex flex-col ml-[55px]">
        <div className="flex-shrink-0">
          <SuperHeader />
        </div>
        <div className="flex-1">
          {/* Content area */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePlaceholder;

