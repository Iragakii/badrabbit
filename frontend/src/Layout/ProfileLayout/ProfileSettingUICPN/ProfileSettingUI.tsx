
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/Header/Header';
import NavBar from '../../../components/NavBar/NavBar';
import ChildTwoSideSetting from './ChildTwoSideSetting';

const ProfileSettingUI = () => {

  return (
    <>
     <div>
       <div className="min-h-screen">
        <div className="flex">
          {/* Fixed NavBar */}
          <div className="z-55">
            <NavBar />
          </div>

          {/* Main content */}
          <div className="flex-1 ml-[60px] mt-[37px]"> {/* Adjust margin based on navbar width */}
            <div className='fixed top-0 left-0 right-0'>
              <Header></Header>
            </div>
            <div className="ml-[55px] mt-[50px]">
               <ChildTwoSideSetting></ChildTwoSideSetting>
               
                
            </div>
            <Footer />
          </div>
        </div>
      </div>

     </div>
      
      
    </>
  );
};

export default ProfileSettingUI;
